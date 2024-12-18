import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { walletAddress, platform, accountId } = await request.json();

    if (!walletAddress || !platform || !accountId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { publicKey: walletAddress },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        platform_accountId: {
          platform,
          accountId,
        },
      },
      update: {
        userId: user.id,
      },
      create: {
        platform,
        accountId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, socialAccount }, { status: 200 });
  } catch (error) {
    console.error('Error linking social account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

