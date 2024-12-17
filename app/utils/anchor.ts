import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import type { BarkNft } from '@/app/types/bark_nft'
import idl from '@/lib/programs/idl/bark_nft.json'
import { logger } from '@/lib/logger'

const programID = new web3.PublicKey('Er8eAGu5j9fV5dUgRJnAzwKtAWvmovjNuyEvdUJrvXet')

export const getProgram = (wallet: web3.Wallet) => {
  const network = 'https://api.devnet.solana.com'
  const connection = new web3.Connection(network, 'processed')

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  )

  return new Program(idl as BarkNft, programID, provider)
}

export const mintNFT = async (
  program: Program<BarkNft>,
  wallet: web3.Keypair,
  uri: string,
  name: string
): Promise<web3.PublicKey> => {
  try {
    const mint = web3.Keypair.generate()
    const token = await getAssociatedTokenAddress(mint.publicKey, wallet.publicKey)

    const tx = new web3.Transaction()

    // Create the token account if it doesn't exist
    const tokenAccountInfo = await program.provider.connection.getAccountInfo(token)
    if (!tokenAccountInfo) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          token,
          wallet.publicKey,
          mint.publicKey
        )
      )
    }

    tx.add(
      await program.methods.mintNft(uri, name)
        .accounts({
          mint: mint.publicKey,
          tokenAccount: token,
          payer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction()
    )

    const txSignature = await program.provider.sendAndConfirm(tx, [mint, wallet])

    logger.info(`NFT minted successfully. Mint address: ${mint.publicKey.toString()}, Transaction signature: ${txSignature}`)
    return mint.publicKey
  } catch (error) {
    logger.error('Error minting NFT:', error)
    throw error
  }
}

export const purchaseNFT = async (
  program: Program<BarkNft>,
  buyer: web3.Keypair,
  seller: web3.PublicKey,
  nftMint: web3.PublicKey,
  price: number
): Promise<string> => {
  try {
    const sellerTokenAccount = await getAssociatedTokenAddress(nftMint, seller)
    const buyerTokenAccount = await getAssociatedTokenAddress(nftMint, buyer.publicKey)

    const tx = new web3.Transaction()

    // Create buyer's associated token account if it doesn't exist
    const accountInfo = await program.provider.connection.getAccountInfo(buyerTokenAccount)
    if (accountInfo === null) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          buyer.publicKey,
          buyerTokenAccount,
          buyer.publicKey,
          nftMint
        )
      )
    }

    tx.add(
      await program.methods.purchaseNft(new BN(price))
        .accounts({
          buyer: buyer.publicKey,
          seller: seller,
          sellerTokenAccount: sellerTokenAccount,
          buyerTokenAccount: buyerTokenAccount,
          mint: nftMint,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction()
    )

    const txSignature = await program.provider.sendAndConfirm(tx, [buyer])

    if (txSignature) {
      logger.info(`NFT purchased successfully. Transaction signature: ${txSignature}`)
      return txSignature
    } else {
      throw new Error('Failed to send transaction')
    }
  } catch (error) {
    logger.error('Error purchasing NFT:', error)
    throw error
  }
}

export const stakeNFT = async (
  program: Program<BarkNft>,
  wallet: web3.Keypair,
  nftMint: web3.PublicKey
): Promise<string> => {
  try {
    const userTokenAccount = await getAssociatedTokenAddress(nftMint, wallet.publicKey)
    const stakingAccount = web3.Keypair.generate()

    const tx = new web3.Transaction()

    tx.add(
      await program.methods.stakeNft()
        .accounts({
          stakingAccount: stakingAccount.publicKey,
          nftMint: nftMint,
          userTokenAccount: userTokenAccount,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction()
    )

    const txSignature = await program.provider.sendAndConfirm(tx, [wallet, stakingAccount])

    logger.info(`NFT staked successfully. Transaction signature: ${txSignature}`)
    return txSignature
  } catch (error) {
    logger.error('Error staking NFT:', error)
    throw error
  }
}

export const unstakeNFT = async (
  program: Program<BarkNft>,
  wallet: web3.Keypair,
  nftMint: web3.PublicKey,
  stakingAccount: web3.PublicKey
): Promise<string> => {
  try {
    const userTokenAccount = await getAssociatedTokenAddress(nftMint, wallet.publicKey)

    const tx = new web3.Transaction()

    tx.add(
      await program.methods.unstakeNft()
        .accounts({
          stakingAccount: stakingAccount,
          nftMint: nftMint,
          userTokenAccount: userTokenAccount,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction()
    )

    const txSignature = await program.provider.sendAndConfirm(tx, [wallet])

    logger.info(`NFT unstaked successfully. Transaction signature: ${txSignature}`)
    return txSignature
  } catch (error) {
    logger.error('Error unstaking NFT:', error)
    throw error
  }
}

export const claimRewards = async (
  program: Program<BarkNft>,
  wallet: web3.Keypair,
  stakingAccount: web3.PublicKey
): Promise<string> => {
  try {
    const tx = new web3.Transaction()

    tx.add(
      await program.methods.claimRewards()
        .accounts({
          stakingAccount: stakingAccount,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .instruction()
    )

    const txSignature = await program.provider.sendAndConfirm(tx, [wallet])

    logger.info(`Rewards claimed successfully. Transaction signature: ${txSignature}`)
    return txSignature
  } catch (error) {
    logger.error('Error claiming rewards:', error)
    throw error
  }
}