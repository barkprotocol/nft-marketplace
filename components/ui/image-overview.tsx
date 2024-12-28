import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

interface ImageOverviewProps {
  imageUrl: string | null
  onDownload: () => void
}

export function ImageOverview({ imageUrl, onDownload }: ImageOverviewProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6 flex flex-col items-center">
        {imageUrl ? (
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={imageUrl}
              alt="NFT Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        ) : (
          <div className="w-full aspect-square mb-4 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No image uploaded</p>
          </div>
        )}
        <Button 
          onClick={onDownload} 
          disabled={!imageUrl} 
          className="mt-4"
          aria-label={imageUrl ? "Download image" : "Image not available to download"}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </Button>
      </CardContent>
    </Card>
  )
}
