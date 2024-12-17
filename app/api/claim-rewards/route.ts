import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { StakedNFT } from '@/app/types/nft'
import { PublicKey } from '@solana/web3.js'

// Input validation schema
const claimRewardsSchema = z.object({
  nftId: z.string().uuid(),
  userId: z.string().uuid(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nftId, userId } = claimRewardsSchema.parse(body)

    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
      include: { owner: true },
    })

    if (!nft || !nft.isStaked) {
      return NextResponse.json({ error: 'NFT not found or not staked' }, { status: 400 })
    }

    if (nft.owner.id !== userId) {
      return NextResponse.json({ error: 'User does not own this NFT' }, { status: 403 })
    }

    const claimedAmount = nft.rewards || 0

    const updatedNFT = await prisma.nFT.update({
      where: { id: nftId },
      data: {
        rewards: 0,
      },
      include: { owner: true },
    })

    // Update user's balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: claimedAmount,
        },
      },
    })

    const stakedNFT: StakedNFT = {
      ...updatedNFT,
      owner: new PublicKey(updatedNFT.owner.publicKey),
      stakedAt: updatedNFT.stakedAt!,
      rewards: 0, // Reset to 0 after claiming
    }

    logger.info('Rewards claimed successfully', { nftId, userId, claimedAmount })

    return NextResponse.json({ 
      message: 'Rewards claimed successfully', 
      claimedAmount, 
      nft: stakedNFT,
      newBalance: updatedUser.balance,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Invalid input data for claiming rewards:', error.errors)
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    logger.error('Error claiming rewards:', error)
    return NextResponse.json({ 
      error: 'Failed to claim rewards', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

