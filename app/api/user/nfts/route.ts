import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const userIdSchema = z.string().uuid()

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = userIdSchema.parse(params.userId)

    const nfts = await prisma.nFT.findMany({
      where: {
        ownerId: userId
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        isListed: true,
        isStaked: true,
        mintAddress: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: nfts
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Invalid user ID', { error: error.errors })
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid user ID'
      }, { status: 400 })
    }

    logger.error('Error fetching user NFTs:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch user NFTs'
    }, { status: 500 })
  }
}