import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const nfts = await prisma.nFT.findMany({
      where: { isListed: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: nfts })
  } catch (error) {
    logger.error('Error fetching NFTs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch NFTs' },
      { status: 500 }
    )
  }
}