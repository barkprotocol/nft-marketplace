# BARK NFT Marketplace

BARK is a decentralized NFT marketplace and staking platform built on the Solana blockchain. It allows users to mint, buy, sell, and stake unique digital assets.

## Features

- Mint new NFTs
- Browse and purchase listed NFTs
- Stake NFTs to earn rewards
- User profiles with owned NFTs and transaction history
- Integration with Solana wallets (Solflare, Metamask, Phantom, Backpack)
- Responsive design using Tailwind CSS and shadcn/ui components

## Technologies Used

- Next.js 15.1.0 with App Router
- React 19
- TypeScript
- Solana Web3.js
- Anchor Framework
- Prisma ORM
- Supabase (PostgreSQL database)
- Tailwind CSS
- shadcn/ui components
- Lucide icons

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Solana CLI tools
- A Solana wallet (Solflare, Metamask, Phantom, or Backpack)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Solana CLI tools
- A Solana wallet (Solflare, Metamask, Phantom, Torus or Backpack)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/bark-protocol/nft-marketplace.git
   cd nft-marketplace
   ```

2. Install dependencies:
   ```
   pnpm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   DATABASE_URL=your_supabase_postgres_url
   NEXT_PUBLIC_SOLANA_RPC_HOST=your_solana_rpc_url
   ```

4. Run database migrations:
   ```
   npx prisma migrate dev
   ```

5. Build the Anchor program:
   ```
   cd lib/programs/bark-nft
   anchor build
   ```

6. Deploy the Anchor program to your Solana network of choice (localnet, devnet, or mainnet-beta).

## Usage

1. Start the development server:
   ```
   pnpm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Connect your Solana wallet using the "Connect Wallet" button in the header.

4. Explore the marketplace, mint new NFTs, or stake your existing NFTs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.