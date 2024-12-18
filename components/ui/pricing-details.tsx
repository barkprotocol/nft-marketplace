import { Card, CardContent } from "@/components/ui/card"

interface PricingDetailsProps {
  nftPrice: number;
  claimFee: number;
  operationalFee: number;
  treasuryFee: number;
  totalPrice: number;
  usdcPrice: number;
}

export function PricingDetails({ 
  nftPrice, 
  claimFee, 
  operationalFee, 
  treasuryFee, 
  totalPrice, 
  usdcPrice 
}: PricingDetailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Pricing</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>NFT Price:</span>
            <span className="font-semibold">{nftPrice.toFixed(2)} SOL</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Claim Fee (0.2%):</span>
            <span>{claimFee.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pl-4">
            <span>- Operational (0.1%):</span>
            <span>{operationalFee.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pl-4">
            <span>- Community Treasury (0.1%):</span>
            <span>{treasuryFee.toFixed(4)} SOL</span>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 my-2"></div>
          <div className="flex justify-between items-center font-semibold">
            <span>Total:</span>
            <span>{totalPrice.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span>USDC Equivalent:</span>
            <span>${usdcPrice.toFixed(2)} USDC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

