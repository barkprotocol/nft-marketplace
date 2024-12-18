import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { convertSOLtoUSDC } from "@/app/utils/price-conversion";

interface NFTCardProps {
  nft: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    creator: string;
  };
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [usdcPrice, setUsdcPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchUSDCPrice = async () => {
      const solPrice = parseFloat(nft.price);
      const usdcAmount = await convertSOLtoUSDC(solPrice);
      setUsdcPrice(usdcAmount.toFixed(2));
    };

    fetchUSDCPrice();
  }, [nft.price]);

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative p-0.5">
        <div className="relative aspect-square w-full border border-gray-200 dark:border-gray-700 overflow-hidden rounded-t-md">
          <Image
            src={nft.imageUrl}
            alt={nft.title}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 left-2 bg-primary/80 text-primary-foreground">NFT</Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{nft.title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 h-8 overflow-hidden">{nft.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Creator: {nft.creator}</p>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{nft.price} SOL</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {usdcPrice ? `≈ $${usdcPrice} USDC` : 'Loading...'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            className="w-full bg-primary text-primary-foreground text-xs rounded-sm"
            onClick={() => console.log(`Minting NFT: ${nft.title}`)}
          >
            Mint
          </Button>
          <Button 
            className="w-full text-xs rounded-sm"
            variant="outline"
            onClick={() => console.log(`View details: ${nft.title}`)}
          >
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

