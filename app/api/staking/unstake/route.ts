import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const { nftId, userId } = await request.json()

    const updatedNFT = await prisma.nFT.update({
      where: { id: nftId },
      data: {
        isStaked: false,
        stakedAt: null,
        rewards: 0,
      },
    })

    logger.info('NFT unstaked successfully', { nftId, userId })

    return NextResponse.json({ message: 'NFT unstaked successfully', nft: updatedNFT })
  } catch (error) {
    logger.error('Error unstaking NFT:', error)
    return NextResponse.json({ error: 'Failed to unstake NFT' }, { status: 500 })
  }
}

