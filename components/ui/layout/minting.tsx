"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

export function BARKMinting() {
  const [isLoading, setIsLoading] = useState(false)
  const [mintAmount, setMintAmount] = useState(1)
  const [claimCode, setClaimCode] = useState('')

  const handleMint = async (type: 'standard' | 'compressed') => {
    setIsLoading(true)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} ${type} NFT(s)`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    setIsLoading(true)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Success!",
        description: "Successfully claimed your NFT",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim NFT. Please check your claim code and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>BARK Protocol Minting</CardTitle>
        <CardDescription>Mint standard or compressed NFTs, or claim your NFT</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="compressed">Compressed</TabsTrigger>
            <TabsTrigger value="claim">Claim</TabsTrigger>
          </TabsList>
          <TabsContent value="standard">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="standard-amount">Amount to Mint</Label>
                <Input
                  id="standard-amount"
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(Number(e.target.value))}
                  min={1}
                  max={10}
                />
              </div>
              <Button onClick={() => handleMint('standard')} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mint Standard NFT
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="compressed">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="compressed-amount">Amount to Mint</Label>
                <Input
                  id="compressed-amount"
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(Number(e.target.value))}
                  min={1}
                  max={100}
                />
              </div>
              <Button onClick={() => handleMint('compressed')} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mint Compressed NFT
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="claim">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claim-code">Claim Code</Label>
                <Input
                  id="claim-code"
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value)}
                  placeholder="Enter your claim code"
                />
              </div>
              <Button onClick={handleClaim} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Claim NFT
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          By minting or claiming, you agree to BARK Protocol's terms and conditions.
        </p>
      </CardFooter>
    </Card>
  )
}

