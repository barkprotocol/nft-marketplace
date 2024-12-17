import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getProgram, purchaseNFT } from '@/app/utils/anchor'
import { web3 } from '@coral-xyz/anchor'
import { logger } from '@/lib/logger'
import { Connection } from '@solana/web3.js'

// Input validation schema
const purchaseSchema = z.object({
  nftId: z.string().uuid(),
  buyerPublicKey: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana public key'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nftId, buyerPublicKey } = purchaseSchema.parse(body)

    const result = await prisma.$transaction(async (prisma) => {
      // Fetch NFT details
      const nft = await prisma.nFT.findUnique({
        where: { id: nftId },
        include: { owner: true },
      })

      if (!nft) {
        throw new Error('NFT not found')
      }

      if (!nft.isListed) {
        throw new Error('NFT is not listed for sale')
      }

      // Fetch buyer details
      const buyer = await prisma.user.findUnique({
        where: { publicKey: buyerPublicKey },
      })

      if (!buyer) {
        throw new Error('Buyer not found')
      }

      if (buyer.balance < (nft.price || 0)) {
        throw new Error('Insufficient balance')
      }

      // Create a new Keypair for the buyer (in a real-world scenario, this would be the buyer's actual keypair)
      const buyerKeypair = web3.Keypair.generate()

      // Get the program instance
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!, 'confirmed')
      const program = getProgram(connection, buyerKeypair)

      // Perform the purchase transaction
      const txSignature = await purchaseNFT(
        program,
        buyerKeypair,
        new web3.PublicKey(nft.owner.publicKey),
        new web3.PublicKey(nft.mintAddress),
        nft.price || 0
      )

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
      const transaction = await prisma.transaction.create({
        data: {
          nftId: nft.id,
          sellerId: nft.ownerId,
          buyerId: buyer.id,
          price: nft.price || 0,
          transactionSignature: txSignature,
        },
      })

      return { updatedNFT, transaction, txSignature }
    })

    logger.info('NFT purchased successfully', { nftId, buyerPublicKey, txSignature: result.txSignature })

    return NextResponse.json({
      success: true,
      message: 'NFT purchased successfully',
      transactionSignature: result.txSignature,
      updatedNFT: result.updatedNFT,
      transaction: result.transaction,
    })
  } catch (error) {
    logger.error('Error purchasing NFT:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

