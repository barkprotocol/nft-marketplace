import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const featuredNFTs = await prisma.nFT.findMany({
      where: { isListed: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(featuredNFTs)
  } catch (error) {
    console.error('Error fetching featured NFTs:', error)
    return NextResponse.json({ error: 'Failed to fetch featured NFTs' }, { status: 500 })
  }
}