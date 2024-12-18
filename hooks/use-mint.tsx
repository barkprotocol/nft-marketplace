import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction
} from '@solana/web3.js';
import { 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useMintContext } from '@/app/contexts/mint-context';
import { toast } from '@/hooks/use-toast';
import * as anchor from "@coral-xyz/anchor";

const PROGRAM_ID = new PublicKey("BARKxvVHNJkzqGvHVfVJTXKnK6wQvZpfBQKZKUoTDWN4");

const idl = require('@/lib/programs/idl/bark_nft_marketplace.json');

export function useMint() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
  const wallet = useWallet();
  const { claimNFT: updateClaimCount } = useMintContext();

  const mintNFT = useCallback(async (uri: string, title: string) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new anchor.AnchorProvider(
        connection,
        wallet as anchor.Wallet,
        { preflightCommitment: 'recent' }
      );

      const program = new anchor.Program(idl, PROGRAM_ID, provider);

      const mintKeypair = anchor.web3.Keypair.generate();
      const tokenAddress = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey
      );

      const metadataAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      ))[0];

      const masterEditionAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      ))[0];

      const tx = new Transaction();

      tx.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: 82,
          lamports: await connection.getMinimumBalanceForRentExemption(82),
          programId: TOKEN_PROGRAM_ID,
        }),
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          tokenAddress,
          wallet.publicKey,
          mintKeypair.publicKey
        ),
        await program.methods.mintNft(wallet.publicKey, uri, title)
          .accounts({
            mintAuthority: wallet.publicKey,
            mint: mintKeypair.publicKey,
            tokenAccount: tokenAddress,
            metadata: metadataAddress,
            masterEdition: masterEditionAddress,
            tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .instruction()
      );

      const signature = await wallet.sendTransaction(tx, connection, { signers: [mintKeypair] });
      await connection.confirmTransaction(signature, 'confirmed');

      console.log(`NFT minted! Signature: ${signature}`);
      updateClaimCount();

      toast({
        title: 'Success!',
        description: `Successfully minted NFT`,
      });
    } catch (err) {
      console.error('Error minting NFT:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to mint NFT: ${errorMessage}`);
      toast({
        title: 'Error',
        description: `Failed to mint NFT: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [wallet, connection, updateClaimCount]);

  const claimNFT = useCallback(async (claimCode: string) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new anchor.AnchorProvider(
        connection,
        wallet as anchor.Wallet,
        { preflightCommitment: 'recent' }
      );

      const program = new anchor.Program(idl, PROGRAM_ID, provider);

      // Fetch the mint address associated with the claim code
      const mintAddress = await fetchMintAddressForClaimCode(claimCode);

      if (!mintAddress) {
        throw new Error('Failed to fetch mint address for claim code');
      }

      const tokenAddress = await getAssociatedTokenAddress(
        mintAddress,
        wallet.publicKey
      );

      const [claimAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("claim"), mintAddress.toBuffer()],
        program.programId
      );

      const tx = new Transaction();

      tx.add(
        await program.methods.claimNft(claimCode)
          .accounts({
            claimer: wallet.publicKey,
            nftMint: mintAddress,
            nftTokenAccount: tokenAddress,
            claimAccount: claimAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
      );

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      console.log("NFT claimed! Transaction signature", signature);

      toast({
        title: 'Success!',
        description: 'Successfully claimed your NFT',
      });

      updateClaimCount();
    } catch (err) {
      console.error('Error claiming NFT:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to claim NFT: ${errorMessage}`);
      toast({
        title: 'Error',
        description: `Failed to claim NFT: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [wallet, connection, updateClaimCount]);

  return {
    mintNFT,
    claimNFT,
    isLoading,
    error,
  };
}

async function fetchMintAddressForClaimCode(claimCode: string): Promise<PublicKey | null> {
  try {
    const response = await fetch('/api/fetch-mint-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claimCode }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mint address');
    }

    const data = await response.json();
    return new PublicKey(data.mintAddress);
  } catch (error) {
    console.error('Error fetching mint address:', error);
    return null;
  }
}

