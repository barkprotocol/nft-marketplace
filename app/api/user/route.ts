import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { publicKey } = await request.json()

    if (!publicKey) {
      return NextResponse.json({ error: 'Public key is required' }, { status: 400 })
    }

    const user = await prisma.user.upsert({
      where: { publicKey },
      update: {},
      create: { publicKey },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error processing user request:', error)
    return NextResponse.json({ error: 'Failed to process user request' }, { status: 500 })
  }
}