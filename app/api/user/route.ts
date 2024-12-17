import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const userSchema = z.object({
  publicKey: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana public key'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { publicKey } = userSchema.parse(body)

    let user
    try {
      user = await prisma.user.upsert({
        where: { publicKey },
        update: {
          lastLogin: new Date(),
        },
        create: { 
          publicKey,
          balance: 0,
          lastLogin: new Date(),
        },
      })
    } catch (dbError) {
      logger.error('Database error:', { error: dbError instanceof Error ? dbError.message : 'Unknown database error' })
      return NextResponse.json({ 
        success: false, 
        error: 'Database error. Please try again later.'
      }, { status: 503 })
    }

    logger.info('User processed successfully', { publicKey: user.publicKey })

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        publicKey: user.publicKey,
        balance: user.balance,
        lastLogin: user.lastLogin,
      }
    })
  } catch (error) {
    logger.error('Error processing user request:', { error: error instanceof Error ? error.message : 'Unknown error' })

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input data',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process user request'
    }, { status: 500 })
  }
}