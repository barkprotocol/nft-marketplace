import { Card, CardContent } from "@/components/ui/card"

export function HowToClaim() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">How to Claim</h3>
        <ol className="space-y-2 text-gray-600 dark:text-gray-300 list-decimal pl-5">
          <li>Connect your Solana wallet</li>
          <li>Choose your preferred payment method</li>
          <li>Ensure you have sufficient balance for the total amount</li>
          <li>Click the "Claim NFT" button below</li>
          <li>Confirm the transaction in your wallet</li>
        </ol>

        <h4 className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">How to Get a Claim Code</h4>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
          <li>Be an owner and holder of BARK tokens</li>
          <li>Follow our project on social media platforms</li>
          <li>Stay tuned for announcements on how to receive your unique claim code</li>
        </ul>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
          More information about claim code distribution will be announced soon. Keep an eye on our official channels for updates!
        </p>
      </CardContent>
    </Card>
  )
}

