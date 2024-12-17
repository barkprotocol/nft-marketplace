import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

export function useWalletConnection() {
  const wallet = useWallet()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey: wallet.publicKey.toBase58() }),
      })
        .then((res) => res.json())
        .then(setUser)
    } else {
      setUser(null)
    }
  }, [wallet.connected, wallet.publicKey])

  return { user, wallet }
}