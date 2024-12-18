import { Card, CardContent } from "@/components/ui/card"

export function NftDetails() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">NFT Details</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
          <li>Unique identifier on the Solana blockchain</li>
          <li>Exclusive access to BARK community events</li>
          <li>Voting rights in community decisions</li>
          <li>Future airdrops and rewards for holders</li>
        </ul>
      </CardContent>
    </Card>
  )
}

