import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function AccordionContent({ id = "bark-accordion" }: { id?: string }) {
    return (
      <>
        <h2 id={`${id}-heading`} className="sr-only">BARK NFT Information</h2>
        <Accordion type="single" collapsible className="w-full" aria-labelledby={`${id}-heading`}>
          <AccordionItem value="nft-details" id={`${id}-nft-details`}>
            <AccordionTrigger id={`${id}-nft-details-trigger`}>NFT Details</AccordionTrigger>
            <AccordionContent aria-labelledby={`${id}-nft-details-trigger`}>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                <li>Unique identifier on the Solana blockchain</li>
                <li>Exclusive access to BARK community events</li>
                <li>Voting rights in community decisions</li>
                <li>Future airdrops and rewards for holders</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="how-to-claim" id={`${id}-how-to-claim`}>
            <AccordionTrigger id={`${id}-how-to-claim-trigger`}>How to Claim</AccordionTrigger>
            <AccordionContent aria-labelledby={`${id}-how-to-claim-trigger`}>
              <ol className="space-y-2 text-gray-600 dark:text-gray-300 list-decimal pl-5">
                <li>Connect your Solana wallet</li>
                <li>Choose your preferred payment method</li>
                <li>Ensure you have sufficient balance for the total amount</li>
                <li>Click the "Claim NFT" button below</li>
                <li>Confirm the transaction in your wallet</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="claim-fees" id={`${id}-claim-fees`}>
            <AccordionTrigger id={`${id}-claim-fees-trigger`}>How BARK Uses Claim Fees</AccordionTrigger>
            <AccordionContent aria-labelledby={`${id}-claim-fees-trigger`}>
              <p className="mb-2 text-gray-600 dark:text-gray-300">The 0.2% claim fee is distributed as follows:</p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                <li>0.1% goes towards operational costs to maintain and improve the BARK platform</li>
                <li>0.1% is allocated to the community treasury and governance, empowering BARK holders to participate in decision-making and fund community initiatives</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    )
  }  