import { File } from 'nft.storage'

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTProperties {
  files?: Array<{
    uri: string;
    type: string;
    cdn?: boolean;
  }>;
  category?: string;
  creators?: Array<{
    address: string;
    share: number;
  }>;
}

export interface Metadata {
  name: string;
  description: string;
  image: File;
  attributes: NFTAttribute[];
  properties?: NFTProperties;
  external_url?: string;
  animation_url?: string;
  background_color?: string;
}

export interface StorageStatus {
  cid: string;
  size: number;
  created: Date;
  pin: {
    status: 'queued' | 'pinning' | 'pinned' | 'failed';
    created: Date;
  };
}

export interface StorageStats {
  totalSize: number;
  totalFiles: number;
  lastUpdate: Date;
}