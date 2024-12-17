import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { getProgram, mintNFT } from '@/app/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    logger.info("Received BARK webhook payload:", payload);

    if (payload.type === "nft_minted") {
      await handleNFTMinted(payload.data);
    } else if (payload.type === "rewards_claimed") {
      await handleRewardsClaimed(payload.data);
    } else {
      logger.warn("Unknown webhook event type:", payload.type);
    }

    return NextResponse.json(
      { status: "success", message: "Webhook received and processed" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error processing webhook:", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "This endpoint only accepts POST requests" },
    { status: 405 }
  );
}

async function handleNFTMinted(data: {
  userPublicKey: string;
  nftName: string;
  nftUri: string;
  mintAddress: string;
}) {
  logger.info("Processing NFT minted event:", data);

  try {
    const user = await prisma.user.findUnique({
      where: { publicKey: data.userPublicKey },
    });

    if (!user) {
      throw new Error(`User not found for public key: ${data.userPublicKey}`);
    }

    const anchorWallet = {
      publicKey: new PublicKey(data.userPublicKey),
      signTransaction: async () => { throw new Error('Not implemented') },
      signAllTransactions: async () => { throw new Error('Not implemented') },
    };

    const program = getProgram(anchorWallet);

    const mintAddress = await mintNFT(
      program,
      anchorWallet,
      data.nftUri,
      data.nftName
    );

    await prisma.nFT.create({
      data: {
        mintAddress: mintAddress.toString(),
        name: data.nftName,
        image: data.nftUri,
        ownerId: user.id,
      },
    });

    logger.info(`NFT minted and stored in database: ${mintAddress.toString()}`);
  } catch (error) {
    logger.error("Error handling NFT minted event:", error);
    throw error;
  }
}

async function handleRewardsClaimed(data: {
  userPublicKey: string;
  amount: number;
  nftId: string;
}) {
  logger.info("Processing rewards claimed event:", data);

  try {
    const user = await prisma.user.findUnique({
      where: { publicKey: data.userPublicKey },
    });

    if (!user) {
      throw new Error(`User not found for public key: ${data.userPublicKey}`);
    }

    const nft = await prisma.nFT.findUnique({
      where: { id: data.nftId },
    });

    if (!nft) {
      throw new Error(`NFT not found with ID: ${data.nftId}`);
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: data.amount } },
      }),
      prisma.nFT.update({
        where: { id: data.nftId },
        data: { rewards: { increment: data.amount } },
      }),
      prisma.rewardsClaim.create({
        data: {
          userId: user.id,
          nftId: data.nftId,
          amount: new BN(data.amount).toNumber(),
        },
      }),
    ]);

    logger.info(`Rewards claimed and stored in database for user: ${user.id}, NFT: ${data.nftId}`);
  } catch (error) {
    logger.error("Error handling rewards claimed event:", error);
    throw error;
  }
}

