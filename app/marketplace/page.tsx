'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletConnection } from '@/hooks/use-wallet-connection'
import { getProgram, mintNFT, purchaseNFT } from '@/app/utils/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from 'lucide-react'
import { NFTCard } from '@/components/ui/layout/nft-cards'
import { logger } from '@/lib/logger'

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
  const { connected, publicKey } = useWallet()
  const { user } = useWalletConnection()
  const anchorWallet = useAnchorWallet()
  const { toast } = useToast()

  useEffect(() => {
    fetchNFTs()
  }, [])

  const fetchNFTs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/nfts')
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs')
      }
      const data = await response.json()
      setNfts(data)
    } catch (error) {
      logger.error('Error fetching NFTs:', error)
      toast({
        title: "Error",
        description: "Failed to load NFTs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuy = async (nftId: string) => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase NFTs.",
        variant: "destructive",
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
      })

      await fetchNFTs()
    } catch (error) {
      logger.error('Error purchasing NFT:', error)
      toast({
        title: "Purchase failed",
        description: "There was an error while purchasing the NFT. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMint = async () => {
    if (!connected || !anchorWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs.",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    try {
      const program = getProgram(anchorWallet)
      const mintAddress = await mintNFT(
        program,
        anchorWallet,
        'https://marketplace.barkprotocol.net/nft.json',
        'BARK NFT'
      )

      logger.info(`NFT minted successfully. Mint address: ${mintAddress.toString()}`)
      toast({
        title: "NFT Minted",
        description: `Successfully minted NFT with address: ${mintAddress.toString()}`,
      })
      
      await fetchNFTs()
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
        <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">NFT Marketplace</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Discover, buy, and collect unique digital assets on the BARK NFT Marketplace
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <Button onClick={handleMint} className="bg-primary text-primary-foreground" disabled={isMinting || !connected}>
          {isMinting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <Plus className="mr-2" size={18} />
              Mint New NFT
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.slice(0, 8).map((nft) => (
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

