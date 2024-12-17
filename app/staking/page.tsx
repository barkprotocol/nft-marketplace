'use client'

import { useState, useEffect } from 'react'
import { useWalletConnection } from '@/hooks/use-wallet-connection'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from 'lucide-react'

interface StakedNFT {
  id: string
  name: string
  stakedDays: number
  rewards: number
  image: string
}

interface UnstakedNFT {
  id: string
  name: string
  image: string
}

export default function Staking() {
  const { user } = useWalletConnection() as { user: { id: string } | null }
  const [stakedNFTs, setStakedNFTs] = useState<StakedNFT[]>([])
  const [unstakedNFTs, setUnstakedNFTs] = useState<UnstakedNFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (user && user.id) {
      fetchNFTs()
    }
  }, [user])

  const fetchNFTs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [stakedResponse, unstakedResponse] = await Promise.all([
        fetch(`/api/staking/${user?.id}/staked`),
        fetch(`/api/staking/${user?.id}/unstaked`)
      ])

      if (!stakedResponse.ok || !unstakedResponse.ok) {
        throw new Error('Failed to fetch NFTs')
      }

      const [stakedData, unstakedData] = await Promise.all([
        stakedResponse.json(),
        unstakedResponse.json()
      ])

      setStakedNFTs(stakedData)
      setUnstakedNFTs(unstakedData)
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setError('Failed to load NFTs. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to load NFTs. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStake = async (nftId: string) => {
    try {
      const response = await fetch('/api/staking/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nftId, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to stake NFT')
      }

      toast({
        title: "Success",
        description: "NFT staked successfully!",
      })
      fetchNFTs()
    } catch (err) {
      console.error('Error staking NFT:', err)
      toast({
        title: "Error",
        description: "Failed to stake NFT. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUnstake = async (nftId: string) => {
    try {
      const response = await fetch('/api/staking/unstake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nftId, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to unstake NFT')
      }

      toast({
        title: "Success",
        description: "NFT unstaked successfully!",
      })
      fetchNFTs()
    } catch (err) {
      console.error('Error unstaking NFT:', err)
      toast({
        title: "Error",
        description: "Failed to unstake NFT. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClaimRewards = async (nftId: string) => {
    try {
      const response = await fetch('/api/staking/claim-rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nftId, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to claim rewards')
      }

      const { claimedAmount } = await response.json()

      toast({
        title: "Success",
        description: `Claimed ${claimedAmount} BARK tokens!`,
      })
      fetchNFTs()
    } catch (err) {
      console.error('Error claiming rewards:', err)
      toast({
        title: "Error",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-xl">Please connect your wallet to view and manage your staked NFTs.</p>
        <Button className="mt-4" onClick={() => toast({ title: "Wallet Connection", description: "Please use the wallet button in the header to connect." })}>
          Connect Wallet
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">NFT Staking</h1>
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl text-red-500">{error}</p>
        <Button className="mt-4" onClick={fetchNFTs}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">NFT Staking</h1>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Your Staked NFTs</h2>
      {stakedNFTs.length === 0 ? (
        <p>You don't have any staked NFTs.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stakedNFTs.map((nft) => (
            <Card key={nft.id}>
              <CardHeader>
                <CardTitle>{nft.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-md" />
                <p className="mt-2">Staked for: {nft.stakedDays} days</p>
                <p>Rewards: {nft.rewards.toFixed(2)} BARK</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleClaimRewards(nft.id)} className="flex-1 mr-2">Claim Rewards</Button>
                <Button onClick={() => handleUnstake(nft.id)} variant="outline" className="flex-1 ml-2">Unstake</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Unstaked NFTs</h2>
      {unstakedNFTs.length === 0 ? (
        <p>You don't have any unstaked NFTs.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {unstakedNFTs.map((nft) => (
            <Card key={nft.id}>
              <CardHeader>
                <CardTitle>{nft.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-md" />
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleStake(nft.id)} className="w-full">Stake</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

