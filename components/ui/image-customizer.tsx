"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customizeImage } from '@/app/utils/image-customization';

interface ImageCustomizerProps {
  imageUrl: string;
  onCustomized: (customizedImageUrl: string) => void;
}

export function ImageCustomizer({ imageUrl, onCustomized }: ImageCustomizerProps) {
  const [backgroundVariation, setBackgroundVariation] = useState<'default' | 'gradient' | 'pattern'>('default');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(20);
  const [textColor, setTextColor] = useState('#000000');
  const [text, setText] = useState('');

  const handleCustomize = async () => {
    try {
      const customizedImageUrl = await customizeImage(imageUrl, {
        backgroundVariation,
        fontFamily,
        fontSize,
        textColor,
        text,
      });
      onCustomized(customizedImageUrl);
    } catch (error) {
      console.error('Error customizing image:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="background-variation">Background Variation</Label>
        <Select value={backgroundVariation} onValueChange={(value: 'default' | 'gradient' | 'pattern') => setBackgroundVariation(value)}>
          <SelectTrigger id="background-variation">
            <SelectValue placeholder="Select background variation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="pattern">Pattern</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="font-family">Font Family</Label>
        <Input id="font-family" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="font-size">Font Size</Label>
        <Input id="font-size" type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
      </div>
      <div>
        <Label htmlFor="text-color">Text Color</Label>
        <Input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="text">Text</Label>
        <Input id="text" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <Button onClick={handleCustomize}>Apply Customization</Button>
    </div>
  );
}

