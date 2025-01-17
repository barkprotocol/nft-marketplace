import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { StakedNFT } from '@/app/types/nft'
import { PublicKey, PublicKeyInitData } from '@solana/web3.js'

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const stakedNFTs = await prisma.nFT.findMany({
      where: {
        ownerId: params.userId,
        isStaked: true,
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

    const formattedStakedNFTs: StakedNFT[] = stakedNFTs.map((nft: { owner: PublicKeyInitData; stakedAt: any; rewards: any }) => ({
      ...nft,
      owner: new PublicKey(nft.owner),
      stakedAt: nft.stakedAt!,
      rewards: nft.rewards || 0,
    }))

    return NextResponse.json(formattedStakedNFTs)
  } catch (error) {
    logger.error('Error fetching staked NFTs:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch staked NFTs', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

