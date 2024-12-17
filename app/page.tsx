import { Button } from "@/components/ui/button"
import Link from 'next/link'
import FeaturedCollection from '@/components/ui/layout/featured-collection'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <img 
          src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
          alt="BARK Logo"
          className="w-32 h-32 mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold mb-6" style={{ color: '#D0C8B9' }}>Welcome to BARK NFT Marketplace</h1>
        <p className="text-xl mb-8 text-gray-600">Discover, buy, sell, and stake unique digital assets</p>
        <div className="flex justify-center space-x-4">
          <Button asChild className="bg-[#D0C8B9] hover:bg-[#BEB6A7] text-black">
            <Link href="/marketplace">Explore Marketplace</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#D0C8B9] text-[#D0C8B9] hover:bg-[#D0C8B9] hover:text-black">
            <Link href="/staking">Start Staking</Link>
          </Button>
        </div>
      </div>
      <FeaturedCollection />
    </div>
  )
}

