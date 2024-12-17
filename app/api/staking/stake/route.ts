import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { StakedNFT } from '@/app/types/nft'
import { PublicKey } from '@solana/web3.js'

// Input validation schema
const stakeSchema = z.object({
  nftId: z.string().uuid(),
  userId: z.string().uuid(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nftId, userId } = stakeSchema.parse(body)

    const updatedNFT = await prisma.nFT.update({
      where: { id: nftId },
      data: {
        isStaked: true,
        stakedAt: new Date(),
      },
      select: {
        id: true,
        mintAddress: true,
        name: true,
        description: true,
        image: true,
        attributes: true,
        price: true,
        owner: true,
        isListed: true,
        isStaked: true,
        createdAt: true,
        updatedAt: true,
        stakedAt: true,
        rewards: true,
      },
    })

    const stakedNFT: StakedNFT = {
      ...updatedNFT,
      owner: new PublicKey(updatedNFT.owner),
      stakedAt: updatedNFT.stakedAt!,
      rewards: updatedNFT.rewards || 0,
    }

    logger.info('NFT staked successfully', { nftId, userId })

    return NextResponse.json({ message: 'NFT staked successfully', nft: stakedNFT })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Invalid input data for staking NFT:', error.errors)
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    logger.error('Error staking NFT:', error)
    return NextResponse.json({ 
      error: 'Failed to stake NFT', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

