# BARK | NFT Marketplace (MVP)

![BARK Hero](public/images/hero.png)

BARK Protocol’s NFT marketplace and staking platform is built on the Solana blockchain, providing an innovative way for users to interact with digital assets. The platform allows minting, buying, selling, customizing, and staking NFTs with efficiency and creativity.

---

## Features

- **Mint Compressed NFTs or Standard NFTs**
- **Browse and Purchase Listed NFTs**
- **Stake NFTs to Earn Rewards**
- **User Profiles**: View owned NFTs and transaction history
- **Wallet Integration**: Supports Solflare, Metamask, Phantom, and Backpack
- **Responsive Design**: Built with Tailwind CSS and Shadcn/ui components

---

## NFT Minting Process

### 1. **Create & Mint**
- Customize your NFT with a **title**, **description**, **royalties**, and text overlays.
- Choose between **standard** and **compressed NFTs**.
- Upload and personalize your NFT image directly in the interface.
- Mint **multiple NFTs** in a single transaction (up to 10).

### 2. **Quick Mint**
- Rapidly mint up to **100 NFTs** using pre-set configurations.
- Ideal for creating **larger collections** quickly.

### 3. **Image Customization**
- Upload your own images or use the default **BARK icon**.
- Add **background variations**, **text overlays**, and more.
- Preview your customized NFT before minting.

### 4. **Minting Progress**
- Real-time **progress bar** for tracking the minting process.
- Clear **success** and **error notifications** for a smooth experience.

### 5. **Social Sharing**
- Share your newly minted NFTs on **social media platforms**.
- Generate **Solana Pay links** for quick and easy NFT purchases.

### 6. **Claim Process**
- Seamlessly claim pre-allocated NFTs using **unique claim codes**.

---

## How It Works

1. **Creating an NFT**
   - Navigate to the "Create & Mint" tab.
   - Fill in details (title, description, royalties, type).
   - Upload and customize your image.
   - Set the quantity (1-100).
   - Click **"Mint NFT"** to begin.

2. **Quick Minting**
   - Go to the "Quick Mint" tab.
   - Select quantity and NFT type.
   - Click **"Quick Mint"** for instant minting.

3. **Claiming an NFT**
   - Access the "Claim" tab.
   - Enter your **unique claim code**.
   - Click **"Claim NFT"** to receive it.

4. **Social Sharing**
   - After minting, use sharing options to showcase your NFT.
   - Generate and share **Solana Pay links** for purchasing.

---

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

---

## Prerequisites

- Node.js (v16 or later)
- npm, pnpm, or yarn
- Solana CLI tools
- A Solana wallet (e.g., Solflare, Metamask, Phantom, Backpack)

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/bark-protocol/nft-marketplace.git
cd nft-marketplace
```

### 2. Install Dependencies
```bash
pnpm install
# or
yarn install
```

### 3. Set Up Environment Variables
Create a `.env.local` file and add:
```env
DATABASE_URL=your_supabase_postgres_url
NEXT_PUBLIC_SOLANA_RPC_HOST=your_solana_rpc_url
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev
```

### 5. Build the Anchor Program
```bash
cd lib/programs/nft-marketplace
anchor build
```

### 6. Deploy the Anchor Program
Deploy to your desired Solana network (localnet, devnet, or mainnet-beta):
```bash
anchor deploy
```

---

## Usage

1. **Start the Development Server**
   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

2. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`.

3. **Connect Your Wallet**
   Use the **Connect Wallet** button in the header to link your Solana wallet.

4. **Explore the Marketplace**
   - Mint new NFTs
   - Buy or sell NFTs
   - Stake NFTs for rewards

---

## Prisma Configuration

1. **Install Prisma**
   ```bash
   pnpm install prisma --save-dev
   pnpm install @prisma/client
   ```

2. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Apply Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Test Prisma Client**
   Create a script (`scripts/test-prisma.ts`) and run:
   ```bash
   npx ts-node scripts/test-prisma.ts
   ```

---

## Contributing

We welcome contributions! Fork the repository and submit a pull request to help improve the platform.

---

## License

This project is licensed under the **MIT License**.
