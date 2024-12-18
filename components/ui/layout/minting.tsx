"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Download } from 'lucide-react'
import { useMint } from "@/hooks/use-mint"
import { ImageOverview } from "@/components/ui/image-overview"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NFTTermsCard } from "@/components/ui/nft-terms-card"
import { ImageCustomizer } from "@/components/ui/image-customizer"
import { SocialShare } from "@/components/ui/social-share"

const PLACEHOLDER_IMAGE_URL = "https://ucarecdn.com/b60a22da-6905-4228-8b18-6967e01ce462/barkicontransparent.webp";

export function Minting() {
  const [isLoading, setIsLoading] = useState(false)
  const [mintAmount, setMintAmount] = useState(1)
  const [claimCode, setClaimCode] = useState('')
  const [nftTitle, setNftTitle] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [customizedImageUrl, setCustomizedImageUrl] = useState<string | null>(null)
  const [mintType, setMintType] = useState<'standard' | 'compressed'>('standard')
  const { toast } = useToast()
  const { mintNFT, claimNFT } = useMint()

  const handleMint = async () => {
    if (!nftTitle || !nftDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const mintFee = calculateMintFee(mintType)
      await mintNFT(nftTitle, nftDescription, customizedImageUrl || imageUrl || PLACEHOLDER_IMAGE_URL, mintType, mintAmount, mintFee)
      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} ${mintType} NFT(s)`,
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
    if (!claimCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a claim code.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await claimNFT(claimCode)
      toast({
        title: "Success!",
        description: "Successfully claimed your NFT",
      })
      setClaimCode('')
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

  const uploadImage = async (file: File): Promise<string> => {
    // TODO: Implement actual image upload logic here
    setImageUrl(PLACEHOLDER_IMAGE_URL);
    return PLACEHOLDER_IMAGE_URL;
  }

  const handleDownload = () => {
    if (customizedImageUrl || imageUrl) {
      const link = document.createElement('a')
      link.href = customizedImageUrl || imageUrl || ''
      link.download = 'nft-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const calculateMintFee = (type: 'standard' | 'compressed'): number => {
    const basePrice = type === 'standard' ? 1 : 0.5 // SOL
    const mintFee = basePrice * 0.002 // 0.2% mint fee
    return mintFee
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold mb-2">BARK NFT Minting</CardTitle>
        <CardDescription className="text-lg text-gray-600 dark:text-gray-300">Create, Mint, or Claim your exclusive BARK NFT</CardDescription>
      </CardHeader>
      <CardContent className="max-w-md mx-auto">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="create">Create & Mint</TabsTrigger>
            <TabsTrigger value="claim">Claim</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nft-title">NFT Title / Name</Label>
                <Input
                  id="nft-title"
                  value={nftTitle}
                  onChange={(e) => setNftTitle(e.target.value)}
                  placeholder="Enter NFT title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nft-type">NFT Type</Label>
                <Select value={mintType} onValueChange={(value) => setMintType(value as 'standard' | 'compressed')}>
                  <SelectTrigger id="nft-type">
                    <SelectValue placeholder="Select NFT Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compressed">Compressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nft-description">Description</Label>
                <Textarea
                  id="nft-description"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  placeholder="Enter NFT description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mint-amount">Amount to Mint</Label>
                <Input
                  id="mint-amount"
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(Math.max(1, Math.min(10, Number(e.target.value))))}
                  min={1}
                  max={10}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">You can mint between 1 and 10 NFTs.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creator-fee">Creator Fee / Treasury</Label>
                <Input
                  id="creator-fee"
                  type="number"
                  value="5"
                  readOnly
                  suffix="%"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">5% of sales go to the creator and community treasury.</p>
              </div>
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {customizedImageUrl || imageUrl ? (
                  <>
                    <Image
                      src={customizedImageUrl || imageUrl || ''}
                      alt="NFT Preview"
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={handleDownload}
                        variant="secondary"
                        size="sm"
                        className="text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No image uploaded</p>
                  </div>
                )}
              </div>
              <ImageCustomizer
                imageUrl={imageUrl || PLACEHOLDER_IMAGE_URL}
                onCustomized={setCustomizedImageUrl}
              />
              <Button onClick={handleMint} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mint {mintType.charAt(0).toUpperCase() + mintType.slice(1)} NFT
              </Button>
              <NFTTermsCard />
              <SocialShare
                nftTitle={nftTitle}
                nftDescription={nftDescription}
                imageUrl={customizedImageUrl || imageUrl || PLACEHOLDER_IMAGE_URL}
              />
            </div>
          </TabsContent>
          <TabsContent value="mint">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quick-mint-amount">Amount to Mint</Label>
                <Input
                  id="quick-mint-amount"
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  min={1}
                  max={100}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">You can mint between 1 and 100 NFTs.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-mint-type">NFT Type</Label>
                <Select value={mintType} onValueChange={(value) => setMintType(value as 'standard' | 'compressed')}>
                  <SelectTrigger id="quick-mint-type">
                    <SelectValue placeholder="Select NFT Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compressed">Compressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleMint} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Quick Mint {mintType.charAt(0).toUpperCase() + mintType.slice(1)} NFT
              </Button>
              <NFTTermsCard className="w-full" />
            </div>
          </TabsContent>
          <TabsContent value="claim">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="claim-code">Claim Code</Label>
                <Input
                  id="claim-code"
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value)}
                  placeholder="Enter your claim code"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter the unique code provided to claim your NFT.</p>
              </div>
              <Button onClick={handleClaim} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Claim NFT
              </Button>
              <NFTTermsCard className="w-full" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

