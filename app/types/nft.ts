import { PublicKey } from '@solana/web3.js';

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTFile {
  uri: string;
  type: string;
}

export interface NFTCreator {
  address: string;
  share: number;
}

export interface NFTProperties {
  files: NFTFile[];
  category: string;
  creators: NFTCreator[];
}

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes: NFTAttribute[];
  properties: NFTProperties;
}

export interface NFT {
  id: string;
  mintAddress: string;
  name: string;
  description?: string;
  image: string;
  attributes: NFTAttribute[];
  price?: number;
  owner: PublicKey;
  isListed: boolean;
  isStaked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StakedNFT extends NFT {
  stakedAt: Date;
  rewards: number;
}

export interface NFTListing {
  id: string;
  nftId: string;
  price: number;
  seller: PublicKey;
  createdAt: Date;
}

export interface NFTTransaction {
  id: string;
  nftId: string;
  fromAddress: string;
  toAddress: string;
  price: number;
  transactionSignature: string;
  createdAt: Date;
}

export interface NFTCollection {
  id: string;
  name: string;
  description?: string;
  image: string;
  nfts: NFT[];
}

