"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Download, AlertTriangle } from 'lucide-react'
import { useMint } from "@/hooks/use-mint-nft"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NFTTermsCard } from "@/components/ui/nft-terms-card"
import { ImageCustomizer } from "@/components/ui/image-customizer"
import { SocialShare } from "@/components/ui/social-share"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

const PLACEHOLDER_IMAGE_URL = "https://ucarecdn.com/93413ee3-c509-497d-8f55-f9fa4589e6de/barkmascottrasparentbg.png";
const PLACEHOLDER_SIZE = { width: 250, height: 250 };

export function Minting() {
  const [isLoading, setIsLoading] = useState(false)
  const [mintAmount, setMintAmount] = useState(1)
  const [claimCode, setClaimCode] = useState('')
  const [nftTitle, setNftTitle] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [customizedImageUrl, setCustomizedImageUrl] = useState<string | null>(null)
  const [mintType, setMintType] = useState<'standard' | 'compressed'>('standard')
  const [mintProgress, setMintProgress] = useState(0)
  const { toast } = useToast()
  const { mintNFT, claimNFT } = useMint()

  useEffect(() => {
    // Reset mint progress when not loading
    if (!isLoading) {
      setMintProgress(0)
    }
  }, [isLoading])

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
      for (let i = 0; i < mintAmount; i++) {
        await mintNFT({
          title: nftTitle,
          description: nftDescription,
          image: customizedImageUrl || imageUrl || PLACEHOLDER_IMAGE_URL,
          type: mintType,
          amount: 1,
          fee: mintFee
        });
        setMintProgress((prev) => prev + (100 / mintAmount))
      }
      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} ${mintType} NFT(s)`,
      })
    } catch (error) {
      console.error('Error minting NFT:', error);
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

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | undefined;
    
    if ('dataTransfer' in event) {
      file = event.dataTransfer.files[0];
    } else if ('target' in event && event.target.files) {
      file = event.target.files[0];
    }

    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size exceeds 5MB limit. Please choose a smaller file.",
          variant: "destructive",
        })
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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

  useEffect(() => {
    const dropArea = document.getElementById('image-upload-area');
    
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = () => {
      dropArea?.classList.add('border-primary');
    };

    const unhighlight = () => {
      dropArea?.classList.remove('border-primary');
    };

    const handleDrop = (e: DragEvent) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      uploadImage(e as unknown as React.DragEvent<HTMLDivElement>);
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea?.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea?.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea?.addEventListener(eventName, unhighlight, false);
    });

    dropArea?.addEventListener('drop', handleDrop, false);

    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea?.removeEventListener(eventName, unhighlight, false);
      });

      dropArea?.removeEventListener('drop', handleDrop, false);
    };
  }, []);

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">NFT Art Generator</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Create, customize, and mint your unique NFT</p>
      </div>
      <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-2">Create, Customize, Mint NFT</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="create">Create & Mint</TabsTrigger>
              <TabsTrigger value="quick-mint">Quick Mint</TabsTrigger>
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
                    type="text"
                    value="5%"
                    readOnly
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">5% of sales go to the creator and community treasury.</p>
                </div>
                <div 
                  id="image-upload-area"
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Label htmlFor="image-upload">Upload Image</Label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    className="hidden"
                  />
                  {customizedImageUrl || imageUrl ? (
                    <div className="relative aspect-square w-full">
                      <Image
                        src={customizedImageUrl || imageUrl}
                        alt="NFT Preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                          }}
                          variant="secondary"
                          size="sm"
                          className="text-black mr-2"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageUrl(null);
                            setCustomizedImageUrl(null);
                          }}
                          variant="destructive"
                          size="sm"
                          className="text-white"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center mt-4">
                      <Image
                        src={PLACEHOLDER_IMAGE_URL}
                        alt="NFT Preview"
                        width={PLACEHOLDER_SIZE.width / 2}
                        height={PLACEHOLDER_SIZE.height / 2}
                        className="rounded-md"
                      />
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
                {isLoading && (
                  <Progress value={mintProgress} className="w-full" />
                )}
                <NFTTermsCard />
                <SocialShare
                  nftTitle={nftTitle}
                  nftDescription={nftDescription}
                  imageUrl={customizedImageUrl || imageUrl || PLACEHOLDER_IMAGE_URL}
                />
              </div>
            </TabsContent>
            <TabsContent value="quick-mint">
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
                {isLoading && (
                  <Progress value={mintProgress} className="w-full" />
                )}
                <NFTTermsCard />
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
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Make sure you have sufficient balance in your wallet to cover the claim fee.
                  </AlertDescription>
                </Alert>
                <NFTTermsCard />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}