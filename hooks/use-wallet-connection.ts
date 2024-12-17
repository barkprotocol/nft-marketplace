import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState, useCallback } from 'react'
import { toast } from "@/hooks/use-toast"
import { WalletName } from '@solana/wallet-adapter-base'

interface User {
  id: string;
  publicKey: string;
  balance: number;
}

export function useWalletConnection() {
  const wallet = useWallet()
  const [user, setUser] = useState<User | null>(null)

  const fetchUserData = useCallback(async () => {
    if (wallet?.connected && wallet?.publicKey?.toBase58) {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicKey: wallet.publicKey.toBase58() }),
        })

        if (!response.ok) {
          if (response.status === 502) {
            throw new Error('Server is temporarily unavailable. Please try again later.')
          }
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch user data')
        }
        setUser(data.data)
      } catch (error) {
        console.error('Error connecting wallet:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
          variant: "destructive",
        })
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [wallet, toast])

  const connectWallet = useCallback((walletName?: WalletName) => {
    if (wallet?.select && walletName) {
      wallet.select(walletName);
    } else if (wallet?.connect) {
      wallet.connect().catch((error: Error) => {
        console.error('Failed to connect wallet:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      console.error('Wallet connection method not available');
      toast({
        title: "Connection Error",
        description: "Wallet connection is not available. Please check your wallet configuration.",
        variant: "destructive",
      });
    }
  }, [wallet]);

  const disconnectWallet = useCallback(() => {
    if (wallet?.disconnect) {
      wallet.disconnect().catch((error: Error) => {
        console.error('Failed to disconnect wallet:', error);
        toast({
          title: "Disconnection Error",
          description: "Failed to disconnect wallet. Please try again.",
          variant: "destructive",
        });
      });
    }
  }, [wallet]);

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  return { 
    user, 
    wallet: {
      ...(wallet || {}),
      publicKey: wallet?.publicKey ?? null,
      connected: wallet?.connected ?? false,
      connecting: wallet?.connecting ?? false,
      disconnecting: wallet?.disconnecting ?? false,
    },
    connectWallet,
    disconnectWallet,
    refreshUserData: fetchUserData
  }
}

