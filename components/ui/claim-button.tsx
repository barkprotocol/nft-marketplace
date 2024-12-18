"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useClaim } from "@/hooks/use-claim"

export default function ClaimButton() {
  const { status, error, claim, isLoading } = useClaim()
  const { toast } = useToast()

  const handleClaim = async () => {
    await claim()
    if (status === 'success') {
      toast({
        title: "NFT Claimed Successfully!",
        description: "Check your wallet for the BARK Genesis NFT.",
      })
    } else if (status === 'error') {
      toast({
        title: "Claim Failed",
        description: error || "There was an error claiming your NFT. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button 
      onClick={handleClaim} 
      disabled={isLoading}
      className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {isLoading ? "Claiming..." : "Claim BARK NFT for 3.5 SOL"}
    </Button>
  )
}

