import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const featuredNFTs = await prisma.nFT.findMany({
      where: { isListed: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
      },
    })

    return NextResponse.json({ success: true, data: featuredNFTs })
  } catch (error) {
    logger.error('Error fetching featured NFTs:', { error: error instanceof Error ? error.message : 'Unknown error' })
    
    if (error instanceof Error && error.message.includes('Invalid `prisma.')) {
      return NextResponse.json(
        { success: false, error: 'Database configuration error. Please check your connection settings.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured NFTs. Please try again later.' },
      { status: 500 }
    )
  }
}