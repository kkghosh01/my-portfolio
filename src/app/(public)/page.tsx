import { About } from "@/components/web/about";
import { Hero } from "@/components/web/hero";
import { StatsCard } from "@/components/web/statsCard";
import { RecentProjects } from "@/components/web/project/recent-projects";
import { RecentPosts } from "@/components/web/blog/recent-posts";
import Link from "next/link";
import Skills from "@/components/web/skills";

export default async function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto mt-3 md:mt-8 w-full max-w-xl">
        <StatsCard />
      </div>
      <About />
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="mb-6 mt-16 text-4xl font-bold">Recent Projects</h2>
          <Link
            href="/projects"
            className="text-sm text-primary hover:underline"
          >
            View All Projects
          </Link>
        </div>

        <RecentProjects />
      </section>

      <section className="mt-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="mb-6 text-4xl font-bold">Latest Blog Posts</h2>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            View All Posts
          </Link>
        </div>

        <RecentPosts />
      </section>
      <section>
        <Skills />
      </section>
    </>
  );
}
