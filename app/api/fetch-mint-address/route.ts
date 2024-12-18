import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { claimCode } = await request.json();

    if (!claimCode) {
      return NextResponse.json({ error: 'Claim code is required' }, { status: 400 });
    }

    // Fetch the BARK mint address associated with the claim code
    const claimCodeRecord = await prisma.claimCode.findUnique({
      where: { code: claimCode },
      include: { nft: true },
    });

    if (!claimCodeRecord || !claimCodeRecord.nft) {
      return NextResponse.json({ error: 'Invalid claim code or no associated NFT' }, { status: 404 });
    }

    return NextResponse.json({ mintAddress: claimCodeRecord.nft.mintAddress }, { status: 200 });
  } catch (error) {
    console.error('Error fetching mint address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

