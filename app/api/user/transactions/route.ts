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

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        nft: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: transactions.map(tx => ({
        id: tx.id,
        type: tx.buyerId === userId ? 'purchase' : 'sale',
        nftName: tx.nft.name,
        nftImage: tx.nft.image,
        price: tx.price,
        timestamp: tx.timestamp,
        transactionSignature: tx.transactionSignature
      }))
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Invalid user ID', { error: error.errors })
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid user ID'
      }, { status: 400 })
    }

    logger.error('Error fetching user transactions:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch user transactions'
    }, { status: 500 })
  }
}