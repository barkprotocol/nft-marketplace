import { NFTStorage, File, Blob } from 'nft.storage'
import { Metadata, StorageStats, StorageStatus } from '@/types/nft'
import { toast } from '@/hooks/use-toast'

if (!process.env.NFT_STORAGE_API_KEY) {
  throw new Error('NFT_STORAGE_API_KEY is not defined in the environment variables')
}

const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

/**
 * Stores an NFT's metadata and assets on IPFS
 */
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
    // Validate image size and type
    if (image.size > 100 * 1024 * 1024) { // 100MB limit
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

    // Store metadata and get IPFS URI
    const metadataURI = await client.store(metadata)
    console.log('NFT data stored successfully. IPFS URL:', metadataURI.url)
    
    // Verify the upload
    const status = await checkStatus(metadataURI.url.split('ipfs://')[1])
    if (status.pin.status === 'failed') {
      throw new Error('Failed to pin content to IPFS')
    }

    toast({
      title: "NFT Storage Success",
      description: "Your NFT data has been successfully stored on IPFS",
    })

    return metadataURI.url
  } catch (error) {
    console.error('Error storing NFT data:', error)
    toast({
      title: "Storage Error",
      description: error instanceof Error ? error.message : "Failed to store NFT data",
      variant: "destructive",
    })
    throw error
  }
}

/**
 * Retrieves NFT metadata from IPFS
 */
export async function retrieveNFT(cid: string): Promise<Metadata> {
  try {
    const metadata = await client.get(cid)
    if (!metadata) {
      throw new Error('Metadata not found')
    }

    // Verify the content is still pinned
    const status = await checkStatus(cid)
    if (status.pin.status === 'failed') {
      throw new Error('Content is not properly pinned')
    }

    return metadata.data as Metadata
  } catch (error) {
    console.error('Error retrieving NFT data:', error)
    toast({
      title: "Retrieval Error",
      description: "Failed to retrieve NFT data from IPFS",
      variant: "destructive",
    })
    throw error
  }
}

/**
 * Stores a single image file on IPFS
 */
export async function storeImage(
  image: File,
  options?: { verify?: boolean }
): Promise<string> {
  try {
    // Create a blob with the file data
    const blob = new Blob([image], { type: image.type })
    
    // Store the blob
    const cid = await client.storeBlob(blob)
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`

    // Verify the upload if requested
    if (options?.verify) {
      const status = await checkStatus(cid)
      if (status.pin.status === 'failed') {
        throw new Error('Failed to pin image to IPFS')
      }
    }

    return ipfsUrl
  } catch (error) {
    console.error('Error storing image:', error)
    toast({
      title: "Image Storage Error",
      description: "Failed to store image on IPFS",
      variant: "destructive",
    })
    throw error
  }
}

/**
 * Stores multiple files on IPFS
 */
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
    console.error('Error storing directory:', error)
    toast({
      title: "Directory Storage Error",
      description: "Failed to store directory on IPFS",
      variant: "destructive",
    })
    throw error
  }
}

/**
 * Checks the status of stored content
 */
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
    console.error('Error checking status:', error)
    throw error
  }
}

/**
 * Gets storage statistics
 */
export async function getStorageStats(): Promise<StorageStats> {
  try {
    const stats = await client.stats()
    return {
      totalSize: stats.totalSize,
      totalFiles: stats.totalFiles,
      lastUpdate: new Date(stats.lastUpdate)
    }
  } catch (error) {
    console.error('Error getting storage stats:', error)
    throw error
  }
}

/**
 * Deletes stored content (if possible)
 */
export async function deleteNFT(cid: string): Promise<void> {
  try {
    await client.delete(cid)
    toast({
      title: "Deletion Success",
      description: "Content has been successfully deleted",
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    toast({
      title: "Deletion Error",
      description: "Failed to delete content",
      variant: "destructive",
    })
    throw error
  }
}

/**
 * Checks if content exists and is properly stored
 */
export async function checkNFTExists(cid: string): Promise<boolean> {
  try {
    const status = await checkStatus(cid)
    return status.pin.status === 'pinned'
  } catch {
    return false
  }
}

