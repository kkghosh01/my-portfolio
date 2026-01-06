import { About } from "@/components/web/about";
import { Hero } from "@/components/web/hero";
import { StatsCard } from "@/components/web/statsCard";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto mt-3 md:mt-8 w-full max-w-xl">
        <StatsCard />
      </div>
      <About />
    </>
  );
}
