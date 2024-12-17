'use client'

import { useEffect, useState } from 'react'
import { useWalletConnection } from '@/hooks/use-wallet-connection'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface NFT {
  id: string
  name: string
  image: string
  description?: string
  price?: number
  isListed: boolean
}

interface Transaction {
  id: string
  type: string
  amount: number
  createdAt: string
  transactionSignature: string
}

export default function Profile() {
  const { user } = useWalletConnection()
  const [userNfts, setUserNfts] = useState<NFT[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        setIsLoading(true)
        setError(null)
        try {
          const [nftsResponse, transactionsResponse] = await Promise.all([
            fetch(`/api/user/${user.id}/nfts`),
            fetch(`/api/user/${user.id}/transactions`)
          ])

          if (!nftsResponse.ok || !transactionsResponse.ok) {
            throw new Error('Failed to fetch user data')
          }

          const [nftsData, transactionsData] = await Promise.all([
            nftsResponse.json(),
            transactionsResponse.json()
          ])

          setUserNfts(nftsData)
          setTransactions(transactionsData)
        } catch (err) {
          console.error('Error fetching user data:', err)
          setError('Failed to load user data. Please try again later.')
          toast({
            title: "Error",
            description: "Failed to load user data. Please try again later.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserData()
  }, [user, toast])

  const handleListNFT = async (nftId: string) => {
    // Implement NFT listing logic here
    toast({
      title: "NFT Listing",
      description: "NFT listing functionality is not implemented yet.",
    })
  }

  const handleUnlistNFT = async (nftId: string) => {
    // Implement NFT unlisting logic here
    toast({
      title: "NFT Unlisting",
      description: "NFT unlisting functionality is not implemented yet.",
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-xl">Please connect your wallet to view your profile.</p>
        <Button className="mt-4" onClick={() => toast({ title: "Wallet Connection", description: "Please use the wallet button in the header to connect." })}>
          Connect Wallet
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl text-red-500">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <p className="mb-4">Public Key: {user.publicKey}</p>
      <p className="mb-4">Balance: {user.balance} SOL</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Your NFTs</h2>
      {userNfts.length === 0 ? (
        <p>You don't own any NFTs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userNfts.map((nft) => (
            <Card key={nft.id}>
              <CardHeader>
                <CardTitle>{nft.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-md" />
                {nft.description && <p className="mt-2 text-sm text-gray-600">{nft.description}</p>}
                {nft.price && <p className="mt-2 font-bold">Price: {nft.price} SOL</p>}
              </CardContent>
              <CardFooter>
                {nft.isListed ? (
                  <Button onClick={() => handleUnlistNFT(nft.id)} variant="outline" className="w-full">Unlist</Button>
                ) : (
                  <Button onClick={() => handleListNFT(nft.id)} className="w-full">List for Sale</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx.id} className="border p-4 rounded">
              <p>Type: {tx.type}</p>
              <p>Amount: {tx.amount} SOL</p>
              <p>Date: {new Date(tx.createdAt).toLocaleString()}</p>
              <Link 
                href={`https://explorer.solana.com/tx/${tx.transactionSignature}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center mt-2"
              >
                View on Solana Explorer
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

