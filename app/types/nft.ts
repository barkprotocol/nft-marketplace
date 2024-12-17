export interface NFTAttribute {
    trait_type: string
    value: string | number
    display_type?: string
  }
  
  export interface Metadata {
    name: string
    description: string
    image: File
    external_url?: string
    animation_url?: string
    background_color?: string
    attributes: NFTAttribute[]
    properties?: {
      files?: Array<{
        uri: string
        type: string
        cdn?: boolean
      }>
      category?: string
      creators?: Array<{
        address: string
        share: number
      }>
    }
  }
  
  export interface StorageStats {
    totalSize: number
    totalFiles: number
    lastUpdate: Date
  }
  
  export interface StorageStatus {
    cid: string
    size: number
    created: Date
    pin: {
      status: 'queued' | 'pinning' | 'pinned' | 'failed'
      created: Date
    }
  }
  
  