"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface MintContextType {
  totalSupply: number
  mintedCount: number
  claimNFT: () => void
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

  const claimNFT = useCallback(() => {
    if (mintedCount < totalSupply) {
      setMintedCount(prev => prev + 1)
    }
  }, [mintedCount, totalSupply])

  return (
    <MintContext.Provider value={{ totalSupply, mintedCount, claimNFT }}>
      {children}
    </MintContext.Provider>
  )
}

