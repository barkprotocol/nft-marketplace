import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getProgram, purchaseNFT } from '@/app/utils/anchor'
import { web3 } from '@coral-xyz/anchor'
import { toast } from '@/hooks/use-toast'

// Input validation schema
const purchaseSchema = z.object({
  nftId: z.string().uuid(),
  buyerPublicKey: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana public key'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nftId, buyerPublicKey } = purchaseSchema.parse(body)

    // Fetch NFT details
    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
      include: { owner: true },
    })

    if (!nft) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
    }

    if (!nft.isListed) {
      return NextResponse.json({ error: 'NFT is not listed for sale' }, { status: 400 })
    }

    // Fetch buyer details
    const buyer = await prisma.user.findUnique({
      where: { publicKey: buyerPublicKey },
    })

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    // Check if buyer has enough balance (assuming you have a balance field in the User model)
    if (buyer.balance < (nft.price || 0)) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Create a new Keypair for the buyer (in a real-world scenario, this would be the buyer's actual keypair)
    const buyerKeypair = web3.Keypair.generate()

    // Get the program instance
    const program = getProgram(buyerKeypair)

    // Perform the purchase transaction
    const txSignature = await purchaseNFT(
      program,
      buyerKeypair,
      new web3.PublicKey(nft.owner.publicKey),
      new web3.PublicKey(nft.mintAddress),
      nft.price || 0
    )

    // Start a Prisma transaction
    const updatedNFT = await prisma.$transaction(async (prisma) => {
      // Update the NFT ownership in the database
      const updatedNFT = await prisma.nFT.update({
        where: { id: nftId },
        data: {
          ownerId: buyer.id,
          isListed: false,
        },
      })

      // Update buyer's balance
      await prisma.user.update({
        where: { id: buyer.id },
        data: {
          balance: {
            decrement: nft.price || 0,
          },
        },
      })

      // Update seller's balance
      await prisma.user.update({
        where: { id: nft.ownerId },
        data: {
          balance: {
            increment: nft.price || 0,
          },
        },
      })

      // Record the transaction
      await prisma.transaction.create({
        data: {
          nftId: nft.id,
          sellerId: nft.ownerId,
          buyerId: buyer.id,
          price: nft.price || 0,
          transactionSignature: txSignature,
        },
      })

      return updatedNFT
    })

    toast({
      title: "Purchase Successful",
      description: `You have successfully purchased the NFT: ${nft.name}`,
    })

    return NextResponse.json({
      message: 'NFT purchased successfully',
      transactionSignature: txSignature,
      updatedNFT,
    })
  } catch (error) {
    console.error('Error purchasing NFT:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    toast({
      title: "Purchase Failed",
      description: "There was an error while purchasing the NFT. Please try again.",
      variant: "destructive",
    })

    return NextResponse.json({ error: 'Failed to purchase NFT' }, { status: 500 })
  }
}

