import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { storeNFT } from '@/lib/storage/nft-storage'
import { createMintNFTTransaction, sendAndConfirmTransaction } from '@/app/utils/anchor'
import { Connection } from '@solana/web3.js'
import { logger } from '@/lib/logger'

export const useMintNFT = (signTransaction: Function, anchorWallet: any) => {
  const [isMinting, setIsMinting] = useState(false)
  const { toast } = useToast()

  const mintNFT = async (formData: FormData) => {
    if (!anchorWallet || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs.",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    try {
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const image = formData.get('image') as File

      // Store NFT metadata on IPFS
      const metadataUri = await storeNFT(image, name, description, [])

      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!, 'confirmed')
      const { transaction, mint } = await createMintNFTTransaction(
        connection,
        anchorWallet.publicKey,
        metadataUri,
        name
      )

      const signedTransaction = await signTransaction(transaction)
      const txSignature = await sendAndConfirmTransaction(
        connection,
        signedTransaction,
        [mint]
      )

      logger.info(`NFT minted successfully. Mint address: ${mint.publicKey.toString()}`)
      toast({
        title: "NFT Minted",
        description: `Successfully minted NFT with address: ${mint.publicKey.toString()}`,
      })

      return mint.publicKey.toString()
    } catch (error) {
      logger.error('Error minting NFT:', error)
      toast({
        title: "Minting failed",
        description: "There was an error while minting the NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  return { isMinting, mintNFT }
}
