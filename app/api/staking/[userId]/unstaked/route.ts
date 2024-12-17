import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { NFT } from '@/app/types/nft'
import { PublicKey } from '@solana/web3.js'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const unstakedNFTs = await prisma.nFT.findMany({
      where: {
        ownerId: params.userId,
        isStaked: false,
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
      },
    })

    const formattedUnstakedNFTs: NFT[] = unstakedNFTs.map((nft) => ({
      ...nft,
      owner: new PublicKey(nft.owner),
    }))

    return NextResponse.json(formattedUnstakedNFTs)
  } catch (error) {
    logger.error('Error fetching unstaked NFTs:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch unstaked NFTs', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

