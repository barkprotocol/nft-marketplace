import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { claimCode } = await request.json();

    if (!claimCode) {
      return NextResponse.json({ error: 'Claim code is required' }, { status: 400 });
    }

    // Check if the claim code exists and is valid
    const validClaimCode = await prisma.claimCode.findUnique({
      where: { code: claimCode, isUsed: false },
    });

    if (!validClaimCode) {
      return NextResponse.json({ isValid: false }, { status: 200 });
    }

    // Mark the claim code as used
    await prisma.claimCode.update({
      where: { id: validClaimCode.id },
      data: { isUsed: true },
    });

    return NextResponse.json({ isValid: true }, { status: 200 });
  } catch (error) {
    console.error('Error verifying claim code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

