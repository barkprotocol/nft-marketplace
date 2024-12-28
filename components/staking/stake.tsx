'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useWalletContext } from '@/hooks/use-wallet-context'

interface NFT {
  id: string
  name: string
  imageUrl: string
  isStaked: boolean
}

export default function Stake() {
  const { user } = useWalletContext() as unknown as { user: { id: string } | null }
  const [nfts, setNfts] = useState<NFT[]>([])
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
      const response = await fetch(`/api/staking/${user?.id}/nfts`)
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs')
      }

      const nftData = await response.json()
      setNfts(nftData)
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setError('Failed to load NFTs. Please try again later.')
      toast({
        title: 'Error',
        description: 'Failed to load NFTs. Please try again later.',
        variant: 'destructive',
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
        title: 'Success',
        description: 'NFT staked successfully!',
      })
      fetchNFTs()
    } catch (err) {
      console.error('Error staking NFT:', err)
      toast({
        title: 'Error',
        description: 'Failed to stake NFT. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>Loading NFTs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts
            .filter((nft) => !nft.isStaked)
            .map((nft) => (
              <div key={nft.id} className="border rounded-lg p-4">
                <img src={nft.imageUrl} alt={nft.name} className="w-full h-48 object-cover mb-4 rounded-lg" />
                <h2 className="text-xl font-semibold mb-2">{nft.name}</h2>
                <button
                  className="w-full py-2 bg-gray-500 text-white rounded-md"
                  onClick={() => handleStake(nft.id)}
                >
                  Stake NFT
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
