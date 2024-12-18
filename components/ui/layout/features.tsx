"use client";

import { useState } from 'react';
import { ShieldCheck, Zap, Users, Palette, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Transactions',
    description: 'Solana blockchain-secured transactions ensure NFT safety and authenticity.',
    details: 'Our platform uses cutting-edge encryption and multi-signature wallets. Every transaction is blockchain-verified, providing an immutable ownership record.'
  },
  {
    icon: Zap,
    title: 'Fast Minting',
    description: 'Create and list NFTs quickly with our streamlined process.',
    details: 'Mint NFTs in seconds, not minutes. We support batch minting for collections and offer customizable metadata fields to showcase your artwork.'
  },
  {
    icon: Users,
    title: 'Community-Driven',
    description: 'Join a vibrant community of artists and collectors.',
    details: 'Engage through forums, virtual galleries, and events. Our DAO model ensures community input in platform development.'
  },
  {
    icon: Palette,
    title: 'Creative Freedom',
    description: 'Express yourself with support for various digital art formats.',
    details: 'From static images to interactive 3D models and generative art, we support a wide range of formats. Create dynamic NFTs that evolve or respond to external data.'
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const handleFeatureClick = (index: number) => {
    setActiveFeature(activeFeature === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white bg-clip-text">
            Features
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover BARK's unique NFT marketplace experience, empowering artists and collectors with cutting-edge features.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${activeFeature === index ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleFeatureClick(index)}
            >
              <CardHeader className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <feature.icon className="w-8 h-8 text-[#d0c8b9]" />
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${activeFeature === index ? 'rotate-90' : ''}`} />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300 mb-4">{feature.description}</CardDescription>
                <AnimatePresence>
                  {activeFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      {feature.details}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

