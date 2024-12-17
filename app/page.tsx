import { createServerSupabaseClient } from '@/app/utils/supabase/server'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import FeaturedCollection from '@/components/ui/layout/featured-collection'

export default async function Home() {
  const supabase = createServerSupabaseClient()
  
  // Fetch featured NFTs from Supabase
  const { data: featuredNFTs, error } = await supabase
    .from('nfts')
    .select('id, name, image, price')
    .eq('is_featured', true)
    .limit(4)

  if (error) {
    console.error('Error fetching featured NFTs:', error)
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12 md:mb-20">
        <img 
          src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
          alt="BARK Logo"
          className="w-32 h-32 mx-auto mb-8 md:mb-12"
        />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-primary">Welcome to BARK NFT Marketplace</h1>
        <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-lg mx-auto">Discover, buy, sell, and stake unique digital assets</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button asChild size="default" className="btn-primary w-full sm:w-auto">
            <Link href="/marketplace">Explore Marketplace</Link>
          </Button>
          <Button asChild size="default" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/staking">Start Staking</Link>
          </Button>
        </div>
      </div>
      <FeaturedCollection initialNFTs={featuredNFTs || []} />
    </div>
  )
}

