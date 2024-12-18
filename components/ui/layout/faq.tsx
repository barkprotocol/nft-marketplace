"use client"

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "What is an NFT?",
    answer: "NFT stands for Non-Fungible Token. It's a unique digital asset that represents ownership of a specific item or piece of content on the blockchain. Unlike cryptocurrencies, each NFT is unique and can't be exchanged on a like-for-like basis."
  },
  {
    question: "How do I purchase a BARK NFT?",
    answer: "To purchase a BARK NFT, you need to connect your Solana wallet to our marketplace, browse the available NFTs, and click on the 'Buy' or 'Bid' button. Follow the prompts to complete the transaction using SOL or USDC."
  },
  {
    question: "What can I do with my BARK NFT?",
    answer: "BARK NFTs provide various benefits, including exclusive access to community events, voting rights in community decisions, and potential future airdrops or rewards. You can also trade or sell your NFT on our marketplace."
  },
  {
    question: "How do I claim my BARK NFT?",
    answer: "To claim your BARK NFT, navigate to the 'Claim' page, connect your Solana wallet, choose your payment method (SOL or USDC), and click the 'Claim NFT' button. Follow the prompts to complete the transaction and receive your NFT."
  },
  {
    question: "What are the fees associated with BARK NFTs?",
    answer: "There's a 0.2% claim fee when minting a BARK NFT. Half of this (0.1%) goes towards operational costs, and the other half (0.1%) is allocated to the community treasury for governance and community initiatives."
  },
  {
    question: "Are BARK NFTs compatible with other marketplaces?",
    answer: "Yes, BARK NFTs are built on the Solana blockchain, making them compatible with other Solana-based NFT marketplaces. However, some special features or benefits may be exclusive to the BARK marketplace."
  },
  {
    question: "How can I ensure the authenticity of my BARK NFT?",
    answer: "All BARK NFTs are minted on the Solana blockchain, ensuring their authenticity and provenance. You can verify your NFT's details, including its unique identifier and transaction history, on Solana block explorers."
  }
]

export function FAQ() {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

