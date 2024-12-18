"use client";

import { useState } from "react";
import Link from "next/link";
import { NFTCard } from "@/components/ui/nft-card";
import { Button } from "@/components/ui/button";

const nfts = [
  { id: 1, title: "TOMMY", description: "Exclusive NFT with unique features.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.5", creator: "BARK Protocol" },
  { id: 2, title: "ACE", description: "Rare collectible from the BARK collection.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.7", creator: "BARK Protocol" },
  { id: 3, title: "BRUNO", description: "Limited edition NFT with special perks.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.6", creator: "BARK Protocol" },
  { id: 4, title: "MAX", description: "Interactive NFT with animated elements.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.8", creator: "BARK Protocol" },
  { id: 5, title: "TRIXIE", description: "NFT with augmented reality features.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.9", creator: "BARK Protocol" },
  { id: 6, title: "MILO", description: "Collectible NFT with community access.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.55", creator: "BARK Protocol" },
  { id: 7, title: "DASH", description: "NFT featuring evolving artwork.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.75", creator: "BARK Protocol" },
  { id: 8, title: "DUKE", description: "NFT with unlockable exclusive content.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.65", creator: "BARK Protocol" },
  { id: 9, title: "LUNA", description: "Moonlight-inspired NFT with glowing effects.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.85", creator: "BARK Protocol" },
  { id: 10, title: "ROCKY", description: "Rugged and durable NFT for adventurers.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.72", creator: "BARK Protocol" },
  { id: 11, title: "BELLA", description: "Beautiful and elegant NFT with floral patterns.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.68", creator: "BARK Protocol" },
  { id: 12, title: "ZEUS", description: "Powerful NFT inspired by Greek mythology.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.95", creator: "BARK Protocol" },
  { id: 13, title: "SCOOT", description: "Speedy NFT with dynamic motion effects.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.78", creator: "BARK Protocol" },
  { id: 14, title: "REX", description: "Regal NFT with a majestic presence.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.88", creator: "BARK Protocol" },
  { id: 15, title: "TWIRL", description: "Graceful NFT with swirling patterns.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.71", creator: "BARK Protocol" },
  { id: 16, title: "JAZZ", description: "Vibrant NFT with musical inspirations.", imageUrl: "https://ucarecdn.com/9416c194-b24e-4780-bf91-f55f4dd8f074/barkblink.png", price: "0.82", creator: "BARK Protocol" },
];

export default function Collection() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = nfts.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Collection
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Discover exclusive BARK NFTs, each a unique piece of digital art showcasing our community's creativity.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {currentCards.map((nft) => (
            <Link key={nft.id} href={`/nft/${nft.id}`} passHref>
              <NFTCard nft={nft} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="mx-2"
          >
            1
          </Button>
          <Button
            onClick={() => setCurrentPage(2)}
            disabled={currentPage === 2}
            className="mx-2"
          >
            2
          </Button>
        </div>
      </div>
    </section>
  );
}

