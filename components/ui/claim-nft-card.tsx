import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ClaimNftCard() {
  return (
    <Card className="w-full overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src="https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png"
          alt="Exclusive BARK NFT"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          Limited Edition
        </Badge>
      </div>
      <CardContent className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-2 text-white">BARK Genesis NFT</h2>
        <p className="text-gray-200 mb-2">
          Be part of the BARK community from day one with this exclusive Genesis NFT.
        </p>
        <p className="text-sm text-gray-300">
          Remaining: 5000 / 5000
        </p>
      </CardContent>
    </Card>
  )
}

