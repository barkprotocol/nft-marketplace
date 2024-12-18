import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Check if the user exists and owns BARK tokens
    const user = await prisma.user.findUnique({
      where: { publicKey: walletAddress },
      include: { 
        nfts: true,
        barkTokens: true,
        socialAccounts: true
      },
    });

    if (!user) {
      return NextResponse.json({ isEligible: false, reason: 'User not found' }, { status: 200 });
    }

    // Check if the user owns BARK tokens
    if (user.barkTokens.length === 0) {
      return NextResponse.json({ isEligible: false, reason: 'No BARK tokens owned' }, { status: 200 });
    }

    // Check if the user has already claimed an NFT
    if (user.nfts.length > 0) {
      return NextResponse.json({ isEligible: false, reason: 'NFT already claimed' }, { status: 200 });
    }

    // Check if the user is following the project on any platform
    const isFollowing = user.socialAccounts.some(account => account.isFollowing);

    if (!isFollowing) {
      return NextResponse.json({ isEligible: false, reason: 'Not following the project on any platform' }, { status: 200 });
    }

    // Check if there are available claim codes
    const availableClaimCode = await prisma.claimCode.findFirst({
      where: { isUsed: false },
    });

    if (!availableClaimCode) {
      return NextResponse.json({ isEligible: false, reason: 'No claim codes available' }, { status: 200 });
    }

    return NextResponse.json({ isEligible: true }, { status: 200 });
  } catch (error) {
    console.error('Error checking claim eligibility:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

