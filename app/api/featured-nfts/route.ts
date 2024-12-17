import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const featuredNFTs = await prisma.nFT.findMany({
      where: { isListed: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: featuredNFTs })
  } catch (error) {
    logger.error('Error fetching featured NFTs:', { error: error instanceof Error ? error.message : 'Unknown error' })
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured NFTs' },
      { status: 500 }
    )
  }
}