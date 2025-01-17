import { NFTStorage, File } from 'nft.storage'
import { Metadata, StorageStats, StorageStatus, NFT, StakedNFT } from '@/app/types/nft'
import { toast } from '@/hooks/use-toast'
import { logger } from '@/lib/logger'

if (!process.env.NFT_STORAGE_API_KEY) {
  logger.error('NFT_STORAGE_API_KEY is not defined in the environment variables')
  throw new Error('NFT_STORAGE_API_KEY is not defined in the environment variables')
}

const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

export async function storeNFT(
  image: File,
  name: string,
  description: string,
  attributes: Metadata['attributes'],
  properties?: Metadata['properties'],
  options?: {
    external_url?: string
    animation_url?: string
    background_color?: string
  }
): Promise<string> {
  try {
    if (image.size > 100 * 1024 * 1024) {
      throw new Error('Image file is too large. Maximum size is 100MB.')
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      throw new Error('Invalid image type. Supported formats: JPEG, PNG, GIF, WebP')
    }

    const metadata: Metadata = {
      name,
      description,
      image,
      attributes,
      ...options,
      properties
    }

    const metadataURI = await client.store(metadata)
    logger.info('NFT data stored successfully. IPFS URL:', metadataURI.url)

    const cid = metadataURI.url.split('ipfs://')[1]
    if (cid) {
      const status = await checkStatus(cid)
      if (status.pin.status === 'failed') {
        throw new Error('Failed to pin content to IPFS')
      }
    } else {
      throw new Error('Failed to extract CID from IPFS URL')
    }

    toast({
      title: "NFT Storage Success",
      description: "Your NFT data has been successfully stored on IPFS",
    })

    return metadataURI.url
  } catch (error) {
    logger.error('Error storing NFT data:', error)
    toast({
      title: "Storage Error",
      description: error instanceof Error ? error.message : "Failed to store NFT data",
      variant: "destructive",
    })
    throw error
  }
}

export async function retrieveNFT(cid: string): Promise<Metadata> {
  try {
    const metadata = await client.get(cid)
    if (!metadata) {
      throw new Error('Metadata not found')
    }

    const status = await checkStatus(cid)
    if (status.pin.status === 'failed') {
      throw new Error('Content is not properly pinned')
    }

    return metadata.ok ? metadata.value : (metadata as unknown as Metadata)
  } catch (error) {
    logger.error('Error retrieving NFT data:', error)
    toast({
      title: "Retrieval Error",
      description: "Failed to retrieve NFT data from IPFS",
      variant: "destructive",
    })
    throw error
  }
}

export async function storeImage(
  image: File,
  options?: { verify?: boolean }
): Promise<string> {
  try {
    const blob = new Blob([image], { type: image.type })
    const cid = await client.storeBlob(blob)
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`

    if (options?.verify) {
      const status = await checkStatus(cid)
      if (status.pin.status === 'failed') {
        throw new Error('Failed to pin image to IPFS')
      }
    }

    return ipfsUrl
  } catch (error) {
    logger.error('Error storing image:', error)
    toast({
      title: "Image Storage Error",
      description: "Failed to store image on IPFS",
      variant: "destructive",
    })
    throw error
  }
}

export async function storeDirectory(
  files: File[],
  options?: { verify?: boolean }
): Promise<string> {
  try {
    const cid = await client.storeDirectory(files)
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`

    if (options?.verify) {
      const status = await checkStatus(cid)
      if (status.pin.status === 'failed') {
        throw new Error('Failed to pin directory to IPFS')
      }
    }

    return ipfsUrl
  } catch (error) {
    logger.error('Error storing directory:', error)
    toast({
      title: "Directory Storage Error",
      description: "Failed to store directory on IPFS",
      variant: "destructive",
    })
    throw error
  }
}

export async function checkStatus(cid: string): Promise<StorageStatus> {
  try {
    const status = await client.status(cid)
    return {
      cid: status.cid,
      size: status.size,
      created: status.created,
      pin: {
        status: status.pin.status,
        created: status.pin.created,
      }
    }
  } catch (error) {
    logger.error('Error checking status:', error)
    throw error
  }
}

export async function deleteNFT(cid: string): Promise<void> {
  try {
    await client.delete(cid)
    toast({
      title: "Deletion Success",
      description: "Content has been successfully deleted",
    })
  } catch (error) {
    logger.error('Error deleting content:', error)
    toast({
      title: "Deletion Error",
      description: "Failed to delete content",
      variant: "destructive",
    })
    throw error
  }
}

export async function checkNFTExists(cid: string): Promise<boolean> {
  try {
    const status = await checkStatus(cid)
    return status.pin.status === 'pinned'
  } catch (error) {
    logger.error('Error checking if NFT exists:', error)
    return false
  }
}

