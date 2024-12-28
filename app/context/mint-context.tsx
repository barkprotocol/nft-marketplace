"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface MintContextType {
  totalSupply: number
  mintedCount: number
  claimNFT: () => void
  canClaim: boolean // Whether the user can claim more NFTs
}

const MintContext = createContext<MintContextType | undefined>(undefined)

export const useMintContext = () => {
  const context = useContext(MintContext)
  if (!context) {
    throw new Error('useMintContext must be used within a MintProvider')
  }
  return context
}

export const MintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mintedCount, setMintedCount] = useState(0)
  const totalSupply = 5000

  // Check if user can claim more NFTs
  const canClaim = mintedCount < totalSupply

  const claimNFT = useCallback(() => {
    if (canClaim) {
      setMintedCount(prev => prev + 1)
      // You can also add any additional logic here such as calling an API to mint the NFT
    } else {
      console.log('Total supply reached. No more NFTs can be minted.');
    }
  }, [mintedCount, canClaim])

  return (
    <MintContext.Provider value={{ totalSupply, mintedCount, claimNFT, canClaim }}>
      {children}
    </MintContext.Provider>
  )
}
