import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const userSchema = z.object({
  publicKey: z.string().min(32).max(44),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { publicKey } = userSchema.parse(body)

    const user = await prisma.user.upsert({
      where: { publicKey },
      update: {},
      create: { 
        publicKey,
        balance: 0, // Initialize with 0 balance
      },
    })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    logger.error('Error processing user request:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process user request' 
    }, { 
      status: error instanceof z.ZodError ? 400 : 500 
    })
  }
}