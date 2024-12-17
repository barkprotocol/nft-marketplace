'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function FeaturedCollection() {
  const [featuredNFTs, setFeaturedNFTs] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedNFTs = async () => {
      try {
        const response = await fetch('/api/featured-nfts')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        if (data.success) {
          setFeaturedNFTs(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch featured NFTs')
        }
      } catch (error) {
        console.error('Error fetching featured NFTs:', error)
        setError('Failed to load featured NFTs. Please try again later.')
        toast({
          title: "Error",
          description: "Failed to load featured NFTs. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedNFTs()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-primary">Loading featured collection...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-destructive/10 rounded-lg">
        <AlertCircle className="inline-block mr-2 h-6 w-6 text-destructive" />
        <span className="text-lg text-destructive">{error}</span>
      </div>
    )
  }

  if (featuredNFTs.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <span className="text-lg text-muted-foreground">No featured NFTs available at the moment.</span>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Featured Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredNFTs.map((nft) => (
          <Card key={nft.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg truncate">{nft.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm font-semibold">{nft.price} SOL</span>
              <Button asChild size="sm">
                <Link href={`/nft/${nft.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}