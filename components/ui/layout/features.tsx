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
    description: 'All transactions are secured by blockchain technology, ensuring the safety and authenticity of your NFTs.',
    details: 'Our platform utilizes state-of-the-art encryption and multi-signature wallets to protect your assets. Every transaction is verified and recorded on the blockchain, providing an immutable record of ownership.'
  },
  {
    icon: Zap,
    title: 'Fast Minting',
    description: 'Create and list your NFTs quickly and easily with our streamlined minting process.',
    details: 'Our optimized minting process allows you to create and list your NFTs in minutes, not hours. We support batch minting for collections and offer customizable metadata fields to showcase your artwork.'
  },
  {
    icon: Users,
    title: 'Community-Driven',
    description: 'Join a thriving community of artists and collectors, collaborating and growing together.',
    details: 'Engage with fellow creators and collectors through our community forums, virtual galleries, and collaborative events. Our DAO governance model ensures that the community has a voice in the platform\'s future development.'
  },
  {
    icon: Palette,
    title: 'Creative Freedom',
    description: 'Express yourself freely with our platform that supports various digital art formats and styles.',
    details: 'From static images to interactive 3D models and generative art, our platform supports a wide range of file formats. We also offer tools for creating dynamic NFTs that can evolve over time or respond to external data.'
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const handleFeatureClick = (index: number) => {
    setActiveFeature(activeFeature === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose BARK</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            BARK offers a unique NFT marketplace experience with cutting-edge features designed to empower artists and collectors alike. Discover why BARK is the go-to platform for NFT enthusiasts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer rounded-md ${activeFeature === index ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleFeatureClick(index)}
            >
              <CardHeader>
                <div className="flex items-center mb-4">
                  <feature.icon className="w-8 h-8 mr-3 text-[#d0c8b9]" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeFeature === index ? 'rotate-90' : ''}`} />
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
                <AnimatePresence>
                  {activeFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 text-sm text-gray-600 dark:text-gray-400"
                    >
                      {feature.details}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 md:mt-16 text-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Creating
          </Button>
        </div>
      </div>
    </section>
  );
}

