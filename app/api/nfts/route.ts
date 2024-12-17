import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const nfts = await prisma.nFT.findMany({
      where: { isListed: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(nfts)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.error()
  }
}