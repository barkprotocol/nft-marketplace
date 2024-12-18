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

- **Next.js** 15.1.0 with App Router
- **React** 19
- **TypeScript**
- **Solana Web3.js**
- **Anchor Framework**
- **Prisma ORM**
- **Supabase** (PostgreSQL database)
- **Tailwind CSS**
- **Shadcn/ui components**
- **Lucide icons**

## Prerequisites

- Node.js (v16 or later)
- npm, pnpm, or yarn
- Solana CLI tools
- A Solana wallet (e.g., Solflare, Metamask, Phantom, Backpack)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bark-protocol/nft-marketplace.git
   cd nft-marketplace
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_supabase_postgres_url
   NEXT_PUBLIC_SOLANA_RPC_HOST=your_solana_rpc_url
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Build the Anchor program:**
   ```bash
   cd lib/programs/bark-nft
   anchor build
   ```

6. **Deploy the Anchor program:**
   Deploy it to the desired Solana network (localnet, devnet, or mainnet-beta):
   ```bash
   anchor deploy
   ```

## Usage

1. **Start the development server:**
   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

3. **Connect your wallet:**
   Use the "Connect Wallet" button in the header to link your Solana wallet.

4. **Explore the marketplace:**
   - Mint new NFTs
   - Buy or sell listed NFTs
   - Stake NFTs to earn rewards

## Prisma Configuration

1. **Install Prisma and Prisma Client:**
   ```bash
   pnpm install prisma --save-dev
   pnpm install @prisma/client
   ```

2. **Initialize Prisma:**
   ```bash
   npx prisma init
   ```

3. **Generate the Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Apply database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Test Prisma Client (optional):**
   Create a script (`scripts/test-prisma.ts`) and run:
   ```bash
   npx ts-node scripts/test-prisma.ts
   ```

### Notes
- **Supabase Console:** Use the Supabase dashboard to monitor and manage tables and data.
- **Migrations:** Always run `npx prisma migrate dev` after schema changes.
- **Production Databases:** Use `npx prisma migrate deploy` for production.

## Contributing

We welcome contributions! Feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.