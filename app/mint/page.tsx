'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletConnection } from '@/hooks/use-wallet-connection'
import { NFTMintForm } from '@/components/nft-mint-form'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'
import { Transaction, Connection, PublicKey } from '@solana/web3.js'
import { sendAndConfirmTransaction } from '@/app/utils/anchor'

export default function MintPage() {
  const [isMinting, setIsMinting] = useState(false)
  const { connected, publicKey, signTransaction } = useWallet()
  const { user } = useWalletConnection()
  const { toast } = useToast()

  const handleMint = async (formData: FormData) => {
    if (!connected || !publicKey || !signTransaction || !user) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs.",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    try {
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          image: formData.get('image'),
          userPublicKey: publicKey.toString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to prepare NFT minting')
      }

      const data = await response.json()

      // Deserialize and sign the transaction
      const transaction = Transaction.from(Buffer.from(data.transaction, 'base64'))
      const signedTransaction = await signTransaction(transaction)

      // Send and confirm the transaction
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!, 'confirmed')
      const txSignature = await sendAndConfirmTransaction(connection, signedTransaction, [])

      toast({
        title: "NFT Minted",
        description: `Successfully minted NFT with address: ${data.mintPublicKey}`,
      })
    } catch (error) {
      console.error('Error minting NFT:', error)
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "There was an error while minting the NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">Mint Your NFT</h1>
        <p className="text-xl mb-8 text-muted-foreground">Connect your wallet to start minting NFTs.</p>
        <Button onClick={() => toast({ title: "Wallet Connection", description: "Please use the wallet button in the header to connect." })}>
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">Mint Your NFT</h1>
      <div className="max-w-md mx-auto">
        <NFTMintForm onSubmit={handleMint} isLoading={isMinting} />
      </div>
    </div>
  )
}

