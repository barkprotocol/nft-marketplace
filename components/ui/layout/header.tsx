'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from "@/components/ui/wallet-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ShoppingBag, Coins, User } from 'lucide-react'

export default function Header() {
  const { connected } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp" 
              alt="BARK Logo" 
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-primary">BARK</span>
          </Link>
          
          <nav className="flex-grow">
            <ul className="flex justify-center space-x-6">
              <li>
                <Link href="/marketplace" className="flex items-center hover:text-primary transition-colors">
                  <ShoppingBag className="mr-1" size={18} />
                  <span>Marketplace</span>
                </Link>
              </li>
              <li>
                <Link href="/staking" className="flex items-center hover:text-primary transition-colors">
                  <Coins className="mr-1" size={18} />
                  <span>Staking</span>
                </Link>
              </li>
              {connected && (
                <li>
                  <Link href="/profile" className="flex items-center hover:text-primary transition-colors">
                    <User className="mr-1" size={18} />
                    <span>Profile</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  )
}

