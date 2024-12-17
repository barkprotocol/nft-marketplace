import { Program, AnchorProvider, web3, BN, Idl } from '@coral-xyz/anchor'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import type { BarkNft } from '@/app/types/bark_nft'
import idl from '@/lib/programs/idl/bark_nft.json'
import { logger } from '@/lib/logger'

const programID = new web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!)

export const getProgram = (connection: web3.Connection, wallet: web3.Keypair | web3.PublicKey): Program<BarkNft> => {
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: wallet instanceof web3.Keypair ? wallet.publicKey : wallet,
      signTransaction: async (tx: web3.Transaction) => tx,
      signAllTransactions: async (txs: web3.Transaction[]) => txs,
    },
    { commitment: 'confirmed' }
  )

  return new Program(idl as BarkNft, programID, provider)
}

export const createMintNFTTransaction = async (
  connection: web3.Connection,
  payer: web3.PublicKey,
  uri: string,
  name: string
): Promise<{ transaction: web3.Transaction; mint: web3.Keypair }> => {
  const program = getProgram(connection, payer)
  const mint = web3.Keypair.generate()
  const token = await getAssociatedTokenAddress(mint.publicKey, payer)

  const tx = new web3.Transaction()

  // Create the token account if it doesn't exist
  const tokenAccountInfo = await connection.getAccountInfo(token)
  if (!tokenAccountInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        payer,
        token,
        payer,
        mint.publicKey
      )
    )
  }

  tx.add(
    await program.methods.mintNft(uri, name)
      .accounts({
        mint: mint.publicKey,
        tokenAccount: token,
        payer: payer,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction()
  )

  return { transaction: tx, mint }
}

export const sendAndConfirmTransaction = async (
  connection: web3.Connection,
  transaction: web3.Transaction,
  signers: web3.Signer[]
): Promise<string> => {
  try {
    const txSignature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
      { commitment: 'confirmed' }
    )
    logger.info(`Transaction sent and confirmed. Signature: ${txSignature}`)
    return txSignature
  } catch (error) {
    logger.error('Error sending and confirming transaction:', error)
    throw error
  }
}

export const mintNFT = async (
  connection: web3.Connection,
  payer: web3.Keypair,
  uri: string,
  name: string
): Promise<web3.PublicKey> => {
  const { transaction, mint } = await createMintNFTTransaction(connection, payer.publicKey, uri, name)
  await sendAndConfirmTransaction(connection, transaction, [payer, mint])
  return mint.publicKey
}

export interface BarkNft {
  version: "0.1.0";
  name: "bark_nft";
  instructions: [
    // ... existing instructions ...
  ];
  address: string;
  metadata: {
    address: string;
  };
}

