"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { customizeImage } from '@/app/utils/image-customization';
import { debounce } from 'lodash';

interface ImageCustomizerProps {
  imageUrl: string;
  onCustomized: (customizedImageUrl: string) => void;
}

const googleFonts = [
  { name: 'Inter', styles: ['Regular', 'semibold', 'Bold'] },
  { name: 'Roboto', styles: ['Regular', 'Bold', 'Italic'] },
  { name: 'Open Sans', styles: ['Regular', 'Bold', 'Italic'] },
  { name: 'Lato', styles: ['Regular', 'Bold', 'Italic'] },
  { name: 'Montserrat', styles: ['Regular', 'Bold', 'Italic'] },
  { name: 'Poppins', styles: ['Regular', 'Bold', 'Italic'] },
];

export function ImageCustomizer({ imageUrl, onCustomized }: ImageCustomizerProps) {
  const [backgroundVariation, setBackgroundVariation] = useState<'default' | 'gradient' | 'pattern'>('default');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontStyle, setFontStyle] = useState('Regular');
  const [fontSize, setFontSize] = useState(20);
  const [textColor, setTextColor] = useState('#010101');
  const [text, setText] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [fontFamily]);

  const applyCustomization = debounce(async () => {
    try {
      const customizedImageUrl = await customizeImage(imageUrl, {
        backgroundVariation,
        fontFamily: `${fontFamily} ${fontStyle}`,
        fontSize,
        textColor,
        text,
        textPosition,
      });
      onCustomized(customizedImageUrl);
    } catch (error) {
      console.error('Error customizing image:', error);
    }
  }, 500); // Debounced call to prevent too many requests

  useEffect(() => {
    applyCustomization();
  }, [imageUrl, backgroundVariation, fontFamily, fontStyle, fontSize, textColor, text, textPosition]);

  const handleTextPositionChange = (axis: 'x' | 'y', value: number) => {
    setTextPosition(prev => ({ ...prev, [axis]: value }));
  };

  const resetCustomization = () => {
    setBackgroundVariation('default');
    setFontFamily('Inter');
    setFontStyle('Regular');
    setFontSize(20);
    setTextColor('#010101');
    setText('');
    setTextPosition({ x: 50, y: 50 });
    onCustomized(imageUrl); // Keep the original image URL when reset
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg w-full">
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
        <Label htmlFor="font-family">Font Family & Style</Label>
        <Select value={`${fontFamily} ${fontStyle}`} onValueChange={(value) => {
          const [family, style] = value.split(' ');
          setFontFamily(family);
          setFontStyle(style || 'Regular');
        }}>
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select font family and style" />
          </SelectTrigger>
          <SelectContent>
            {googleFonts.map((font) => (
              font.styles.map((style) => (
                <SelectItem key={`${font.name} ${style}`} value={`${font.name} ${style}`}>
                  <span style={{ fontFamily: font.name, fontWeight: style === 'Bold' ? 'bold' : 'normal', fontStyle: style === 'Italic' ? 'italic' : 'normal' }}>
                    {font.name} {style}
                  </span>
                </SelectItem>
              ))
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between items-center">
        <Label htmlFor="font-size">Font Size</Label>
        <span className="text-sm text-gray-500 dark:text-gray-400">{fontSize}px</span>
      </div>
      <Slider
        id="font-size"
        min={10}
        max={72}
        step={1}
        value={[fontSize]}
        onValueChange={(value) => setFontSize(value[0])}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="text">Text</Label>
          <Input id="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="text-color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-8 p-0 rounded-sm"
            />
            <Input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-grow"
            />
          </div>
        </div>
      </div>
      <div>
        <Label>Text Position</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="text-position-x">X</Label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{textPosition.x}%</span>
            </div>
            <Slider
              id="text-position-x"
              min={0}
              max={100}
              step={1}
              value={[textPosition.x]}
              onValueChange={(value) => handleTextPositionChange('x', value[0])}
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="text-position-y">Y</Label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{textPosition.y}%</span>
            </div>
            <Slider
              id="text-position-y"
              min={0}
              max={100}
              step={1}
              value={[textPosition.y]}
              onValueChange={(value) => handleTextPositionChange('y', value[0])}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between space-x-4 mt-6">
        <Button 
          variant="outline" 
          onClick={resetCustomization} 
          className="flex-1 bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          Reset
        </Button>
        <Button 
          onClick={() => onCustomized(imageUrl)} 
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
}
