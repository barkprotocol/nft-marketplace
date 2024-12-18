import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import ClaimButton from '@/components/ui/claim-button'

const NFT_PRICE = 1; // Price in SOL
const CLAIM_FEE_PERCENTAGE = 0.001; // 0.1%
const TREASURY_FEE_PERCENTAGE = 0.0005; // 0.05%

export default function ClaimPage() {
  const claimFee = NFT_PRICE * CLAIM_FEE_PERCENTAGE;
  const treasuryFee = NFT_PRICE * TREASURY_FEE_PERCENTAGE;
  const totalPrice = NFT_PRICE + claimFee;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          Claim Your Exclusive BARK NFT
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Large Card */}
          <Card className="w-full max-w-2xl mx-auto overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src="https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png"
                alt="Exclusive BARK NFT"
                layout="fill"
                objectFit="cover"
              />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                Limited Edition
              </Badge>
            </div>
            <CardContent className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-2 text-white">BARK Genesis NFT</h2>
              <p className="text-gray-200 text-lg">
                Be part of the BARK community from day one with this exclusive Genesis NFT.
              </p>
            </CardContent>
          </Card>

          {/* Right side - Details, How to Claim, and Claim Button */}
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">NFT Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">NFT Details</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                  <li>Unique identifier on the Solana blockchain</li>
                  <li>Exclusive access to BARK community events</li>
                  <li>Voting rights in community decisions</li>
                  <li>Future airdrops and rewards for holders</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Pricing</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>NFT Price:</span>
                    <span className="font-semibold">{NFT_PRICE} SOL</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Claim Fee (0.1%):</span>
                    <span>{claimFee.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Community Treasury (0.05%):</span>
                    <span>{treasuryFee.toFixed(4)} SOL</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span>{totalPrice.toFixed(4)} SOL</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Payment Method</h3>
                <RadioGroup defaultValue="sol" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sol" id="sol" />
                    <Label htmlFor="sol" className="flex items-center space-x-2">
                      <Image src="/solana-icon.svg" alt="SOL" width={24} height={24} />
                      <span>SOL</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="usdc" id="usdc" />
                    <Label htmlFor="usdc" className="flex items-center space-x-2">
                      <Image src="/usdc-icon.svg" alt="USDC" width={24} height={24} />
                      <span>USDC</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">How to Claim</h3>
                <ol className="space-y-2 text-gray-600 dark:text-gray-300 list-decimal pl-5">
                  <li>Connect your Solana wallet</li>
                  <li>Choose your preferred payment method</li>
                  <li>Ensure you have sufficient balance for the total amount</li>
                  <li>Click the "Claim NFT" button below</li>
                  <li>Confirm the transaction in your wallet</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <ClaimButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

