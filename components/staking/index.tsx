'use client'

import Stake from '@/components/staking/stake'
import Unstake from '@/components/staking/unstake'

export default function StakingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Manage Your NFTs</h1>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Stake Your NFTs</h2>
          <Stake />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Unstake Your NFTs</h2>
          <Unstake />
        </section>
      </div>
    </div>
  )
}
