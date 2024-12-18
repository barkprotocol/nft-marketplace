import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Twitter, MessageCircle, Send, Instagram } from 'lucide-react';
import { generateBlink, createBlinkQR } from '@/app/utils/blink';
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  nftTitle: string;
  nftDescription: string;
  imageUrl: string;
}

export function SocialShare({ nftTitle, nftDescription, imageUrl }: SocialShareProps) {
  const [blinkUrl, setBlinkUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const recipient = process.env.NEXT_PUBLIC_BARK_WALLET_ADDRESS;
      if (!recipient) {
        throw new Error('Wallet address not configured');
      }
      const amount = 0; // Set to 0 for now, can be adjusted later if needed
      const label = 'BARK NFT Share';
      const message = `Check out my NFT: ${nftTitle}`;
      const memo = 'Shared via BARK NFT Marketplace';

      const url = await generateBlink(recipient, amount, label, message, memo);
      setBlinkUrl(url);

      const qr = await createBlinkQR(url);
      setQrCode(qr);

      toast({
        title: "Link Generated",
        description: "Your BARK Blink link has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating Blink link:', error);
      toast({
        title: "Error",
        description: "Failed to generate BARK Blink link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (platform: 'x' | 'discord' | 'telegram' | 'instagram') => {
    const text = `Check out my NFT: ${nftTitle} - ${nftDescription}`;
    let shareUrl = '';

    switch (platform) {
      case 'x':
        shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(blinkUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(blinkUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'discord':
      case 'instagram':
        navigator.clipboard.writeText(`${text} ${blinkUrl}`);
        toast({
          title: "Link Copied",
          description: `The link has been copied to your clipboard. You can now paste it into your ${platform === 'discord' ? 'Discord' : 'Instagram'} post.`,
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blinkUrl);
    toast({
      title: "Link Copied",
      description: "The BARK Blink link has been copied to your clipboard.",
    });
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Share Your NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <Button 
            onClick={handleGenerateLink} 
            disabled={isLoading}
            className="w-full bg-[#d0c8b9] hover:bg-[#c5bdae] text-gray-900"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4" />}
            Generate BARK Blink Link
          </Button>
          
          {blinkUrl && (
            <div className="space-y-2">
              <Label htmlFor="blink-url" className="text-gray-700 dark:text-gray-300">BARK Blink URL</Label>
              <div className="flex">
                <Input 
                  id="blink-url" 
                  value={blinkUrl} 
                  readOnly 
                  className="flex-grow rounded-r-none"
                />
                <Button 
                  onClick={copyToClipboard}
                  className="rounded-l-none bg-[#d0c8b9] hover:bg-[#c5bdae] text-gray-900"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {qrCode && (
            <div className="flex justify-center">
              <img src={qrCode} alt="BARK Blink QR Code" className="w-32 h-32" />
            </div>
          )}
          
          {blinkUrl && (
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Share on Social Media</Label>
              <div className="flex justify-center space-x-2">
                <Button onClick={() => handleShare('x')} aria-label="Share on X" className="bg-black text-white hover:bg-gray-800">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleShare('discord')} aria-label="Share on Discord" className="bg-[#5865F2] text-white hover:bg-[#4752C4]">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleShare('telegram')} aria-label="Share on Telegram" className="bg-[#0088cc] text-white hover:bg-[#0077b5]">
                  <Send className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleShare('instagram')} aria-label="Share on Instagram" className="bg-[#E4405F] text-white hover:bg-[#d63a54]">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <Alert className="mb-4">
            <AlertDescription className="text-center">
              Sharing your NFT helps grow the BARK community and increases the value of your digital asset.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}

