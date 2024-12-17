import { NextRequest, NextResponse } from 'next/server'
import { createMintNFTTransaction } from '@/app/utils/anchor'
import { PublicKey, Connection } from '@solana/web3.js'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { storeNFT } from '@/lib/storage/nft-storage'

export async function POST(request: NextRequest) {
  try {
    const { name, description, image, userPublicKey } = await request.json()

    if (!name || !description || !image || !userPublicKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store NFT metadata on IPFS
    const attributes = [
      { trait_type: 'Creator', value: userPublicKey },
      { trait_type: 'Created', value: new Date().toISOString() }
    ]
    const metadata = await storeNFT(image, name, description, attributes)
    
    // Get Solana connection
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!, 'confirmed')

    // Create mint NFT transaction
    const { transaction, mint } = await createMintNFTTransaction(
      connection,
      new PublicKey(userPublicKey),
      metadata,
      name
    )

    // Store NFT in database
    const user = await prisma.user.findUnique({ where: { publicKey: userPublicKey } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const nft = await prisma.nFT.create({
      data: {
        mintAddress: mint.publicKey.toString(),
        name,
        description,
        image: metadata.replace('ipfs://', 'https://ipfs.io/ipfs/'),
        metadataUri: metadata,
        ownerId: user.id,
      },
    })

    logger.info(`NFT prepared for minting: ${mint.publicKey.toString()}`)

    return NextResponse.json({ 
      success: true, 
      transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
      mintPublicKey: mint.publicKey.toString(),
      nft 
    })
  } catch (error) {
    logger.error('Error preparing NFT minting:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: 'Failed to prepare NFT minting', details: errorMessage }, { status: 500 })
  }
}

