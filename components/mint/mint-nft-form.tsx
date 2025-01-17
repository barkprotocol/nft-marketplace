'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NFTMintFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isLoading: boolean
}

export function NFTMintForm({ onSubmit, isLoading }: NFTMintFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (imageFile) {
      formData.set('image', imageFile)
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue submitting the form. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">NFT Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input 
          id="image" 
          name="image" 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          required 
        />
        {imageFile && <p className="text-sm text-muted-foreground mt-2">{imageFile.name}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting...
          </>
        ) : (
          'Mint NFT'
        )}
      </Button>
    </form>
  )
}
