'use client'

import { useState, useEffect } from 'react'
import { useWalletConnection } from '@/hooks/use-wallet-connection'
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, ChevronDown } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const walletOptions = [
  { name: 'Phantom', icon: '👻' },
  { name: 'Solflare', icon: '🔆' },
  { name: 'Backpack', icon: '🎒' },
]

export function WalletButton() {
  const { wallet } = useWalletConnection()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline">Loading...</Button>
  }

  if (wallet.connected && wallet.publicKey) {
    return (
      <Button
        variant="outline"
        className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={wallet.disconnect}
      >
        <span className="hidden sm:inline">{wallet.publicKey.toBase58().slice(0, 4)}...{wallet.publicKey.toBase58().slice(-4)}</span>
        <LogOut className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {walletOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onClick={() => {
              if (wallet.select) {
                wallet.select(option.name)
              } else if (wallet.connect) {
                wallet.connect()
              }
            }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <span>{option.icon}</span>
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

