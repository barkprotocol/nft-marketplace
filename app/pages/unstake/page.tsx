'use client'

import Staking from '@/components/staking/stake'
import Head from 'next/head'

export default function StakePage() {
  return (
    <>
      <Head>
        <title>Stake Your NFTs | BARK Protocol</title>
        <meta name="description" content="Stake your BARK NFTs and earn rewards." />
      </Head>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Stake Your NFTs</h1>
        <Staking initialTab="unstake" />
      </div>
    </>
  );
}
