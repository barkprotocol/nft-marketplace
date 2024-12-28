'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletContext } from '@/hooks/use-wallet-context'
import { getProgram, createMintNFTTransaction, sendAndConfirmTransaction } from '@/app/utils/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from 'lucide-react'
import { NFTCard } from '@/components/ui/nft-card'
import { logger } from '@/lib/logger'
import { Connection, Keypair } from '@solana/web3.js'
import { NFTMintForm } from '@/components/mint/mint-nft-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { storeNFT } from '@/lib/storage/nft-storage'

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function Marketplace() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMinting, setIsMinting] = useState(false)
  const [mintDialogOpen, setMintDialogOpen] = useState(false)
  const { connected, publicKey, signTransaction, disconnect } = useWallet() // added disconnect here
  const { user } = useWalletContext()
  const anchorWallet = useAnchorWallet()
  const { toast } = useToast()

  const fetchNFTs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/nfts')
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs')
      }
      const data = await response.json()
      setNfts(data.data)
    } catch (error) {
      logger.error('Error fetching NFTs:', error)
      toast({
        title: "Error",
        description: "Failed to load NFTs. Please try again.",
        variant: "default", // Changed to default
        "aria-live": "assertive", // Ensuring the toast is announced for screen readers
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (!connected) {
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected. Please reconnect to continue.",
        variant: "default", // Changed to default
        "aria-live": "assertive",
      })
    }
  }, [connected, toast]) // Added listener for wallet disconnect

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  const handleBuy = async (nftId: string) => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase NFTs.",
        variant: "destructive",
        "aria-live": "assertive", // Ensuring the toast is announced for screen readers
      })
      return
    }

    try {
      const response = await fetch('/api/purchase-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftId,
          buyerPublicKey: publicKey.toString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to purchase NFT')
      }

      const data = await response.json()

      logger.info(`NFT purchased successfully. Transaction signature: ${data.transactionSignature}`)
      toast({
        title: "Purchase successful",
        description: `You have successfully purchased the NFT! Transaction signature: ${data.transactionSignature}`,
        "aria-live": "assertive",
      })

      await fetchNFTs()
    } catch (error) {
      logger.error('Error purchasing NFT:', error)
      toast({
        title: "Purchase failed",
        description: "There was an error while purchasing the NFT. Please try again.",
        variant: "destructive",
        "aria-live": "assertive",
      })
    }
  }

  const handleMint = async (formData: FormData) => {
    if (!connected || !anchorWallet || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs.",
        variant: "destructive",
        "aria-live": "assertive",
      })
      return
    }

    setIsMinting(true)
    try {
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const image = formData.get('image') as File

      // Validate form data
      if (!name || !description || !image) {
        toast({
          title: "Invalid form data",
          description: "Please ensure all fields are filled out correctly.",
          variant: "destructive",
          "aria-live": "assertive",
        })
        return
      }

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
        "aria-live": "assertive",
      })
      
      await fetchNFTs()
      setMintDialogOpen(false)
    } catch (error) {
      logger.error('Error minting NFT:', error)
      toast({
        title: "Minting failed",
        description: "There was an error while minting the NFT. Please try again.",
        variant: "destructive",
        "aria-live": "assertive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading marketplace...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">NFT Marketplace</h1>
        <p className="text-xl text-muted-foreground">
          Discover, buy, and collect unique digital assets on the BARK NFT Marketplace
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <Dialog open={mintDialogOpen} onOpenChange={setMintDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground" disabled={!connected}>
              <Plus className="mr-2 h-5 w-5" /> Mint New NFT
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mint New NFT</DialogTitle>
            </DialogHeader>
            <NFTMintForm onSubmit={handleMint} isLoading={isMinting} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id}
            id={nft.id}
            name={nft.name}
            image={nft.image}
            price={nft.price}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  )
}
