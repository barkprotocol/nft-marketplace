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
import { WalletName } from '@solana/wallet-adapter-base'

const walletOptions = [
  { name: 'Phantom' as WalletName, icon: '👻' },
  { name: 'Solflare' as WalletName, icon: '🔆' },
  { name: 'Backpack' as WalletName, icon: '🎒' },
]

export function WalletButton() {
  const { wallet, connectWallet, disconnectWallet } = useWalletConnection()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="default">Loading...</Button>
  }

  if (wallet.connected && wallet.publicKey) {
    return (
      <Button
        variant="outline"
        size="default"
        className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={disconnectWallet}
      >
        <span className="hidden sm:inline text-sm">{wallet.publicKey.toBase58().slice(0, 4)}...{wallet.publicKey.toBase58().slice(-4)}</span>
        <LogOut className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Wallet className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Connect</span>
          <ChevronDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {walletOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onClick={() => connectWallet(option.name)}
            className="flex items-center space-x-2 cursor-pointer text-sm"
          >
            <span>{option.icon}</span>
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

