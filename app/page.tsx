import Hero from "@/components/ui/layout/hero";
import Features from "@/components/ui/layout/features";
import Collection from "@/components/ui/layout/collection";

export default function Home() {
  return (
    <main>
      <section aria-label="Hero">
        <Hero />
      </section>
      <section aria-label="Features">
        <Features />
      </section>
      <section aria-label="Collection">
        <Collection />
      </section>
    </main>
  );
}
