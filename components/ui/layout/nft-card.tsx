import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'

interface NFTCardProps {
  id: string
  name: string
  image: string
  price: number
  onBuy: (id: string) => void
}

export function NFTCard({ id, name, image, price, onBuy }: NFTCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <span className="text-lg font-semibold">{price} SOL</span>
        <Button onClick={() => onBuy(id)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}

