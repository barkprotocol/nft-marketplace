'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

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
    fetch('/api/featured-nfts')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
        setFeaturedNFTs(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching featured NFTs:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading featured collection...</div>
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <AlertCircle className="inline-block mr-2" />
        {error}
      </div>
    )
  }

  if (featuredNFTs.length === 0) {
    return <div className="text-center">No featured NFTs available at the moment.</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#D0C8B9' }}>Featured Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredNFTs.map((nft) => (
          <Card key={nft.id}>
            <CardHeader>
              <CardTitle>{nft.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <span>{nft.price} SOL</span>
              <Button asChild>
                <Link href={`/nft/${nft.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}