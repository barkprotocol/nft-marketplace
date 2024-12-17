import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';

export interface BarkNftProgram extends Program<BarkNft> {}

export interface BarkNft extends Idl {
  version: "0.1.0";
  name: "bark_nft";
  instructions: [
    {
      name: "initialize";
      accounts: [];
      args: [];
    },
    {
      name: "mintNft";
      accounts: [
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "uri";
          type: "string";
        },
        {
          name: "name";
          type: "string";
        }
      ];
    },
    {
      name: "purchaseNft";
      accounts: [
        {
          name: "buyer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "seller";
          isMut: true;
          isSigner: false;
        },
        {
          name: "sellerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "price";
          type: "u64";
        }
      ];
    }
  ];
  address: string;
  metadata: {
    address: string;
  };
}

export interface MintNftAccounts {
  mint: PublicKey;
  tokenAccount: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
  rent: PublicKey;
}

export interface MintNftArgs {
  uri: string;
  name: string;
}

export interface PurchaseNftAccounts {
  buyer: PublicKey;
  seller: PublicKey;
  sellerTokenAccount: PublicKey;
  buyerTokenAccount: PublicKey;
  mint: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
}

export interface PurchaseNftArgs {
  price: bigint;
}

export type BarkNftProvider = AnchorProvider;

