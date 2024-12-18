import Hero from "@/components/ui/layout/hero";
import Features from "@/components/ui/layout/features";
import Collection from "@/components/ui/layout/collection";
import { FAQ } from "@/components/ui/layout/faq";
import { Minting } from "@/components/ui/layout/minting";

export default function Home() {
  return (
    <main>
      <section aria-label="Hero">
        <Hero />
      </section>
      <section aria-label="Mint and Claim" className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Minting />
        </div>
      </section>
      <section aria-label="Features">
        <Features />
      </section>
      <section aria-label="Collection">
        <Collection />
      </section>
      <section aria-label="Frequently Asked Questions">
        <FAQ />
      </section>
    </main>
  );
}

