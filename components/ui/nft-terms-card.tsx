import { Card, CardContent } from "@/components/ui/card"
import { Info } from 'lucide-react'

export function NFTTermsCard() {
  return (
    <Card className="bg-white dark:bg-gray-800 mt-6">
      <CardContent className="flex items-start space-x-4 p-4">
        <Info className="w-6 h-6 text-[#d0c8b9] flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Minting fee: 0.2% + Solana transaction fees
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            By minting or claiming, you agree to BARK Protocol's terms and conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
