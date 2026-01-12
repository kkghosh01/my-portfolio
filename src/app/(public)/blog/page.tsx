import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Blog() {
  return (
    <section className="py-10">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-muted-foreground">
          Insights, thoughts, and ideas!
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadngUi />}>
        <LoadBlogList />
      </Suspense>
    </section>
  );
}

async function LoadBlogList() {
  const data = await fetchQuery(api.posts.getPublishedPosts);
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <article key={post._id.toString()} className="group">
          <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700">
            {/* Image Container - No top spacing */}
            <div className="relative aspect-video w-full overflow-hidden -mt-6 mx-auto -mb-6">
              <Image
                src={
                  post.imageUrl ||
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={false}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
            </div>

            <CardContent className="p-6">
              {/* Title */}
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </h2>
              </Link>

              {/* Meta Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="font-medium">{post.authorName}</span>
                </div>

                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />

                <time
                  dateTime={new Date(post._creationTime).toISOString()}
                  className="flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post._creationTime).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>

              {/* Excerpt */}
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6">
                {post.content}
              </p>
            </CardContent>

            <CardFooter className="px-6 pb-6 pt-0">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-200 group/readmore"
              >
                Read article
                <svg
                  className="w-4 h-4 transition-transform group-hover/readmore:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </CardFooter>
          </Card>
        </article>
      ))}
    </div>
  );
}

function SkeletonLoadngUi() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-xl border"
        >
          {/* Image */}
          <Skeleton className="h-48 w-full" />

          {/* Content */}
          <div className="flex flex-col gap-3 p-4">
            {/* Title */}
            <Skeleton className="h-6 w-4/5" />

            {/* Author + Date (inline) */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" /> {/* author */}
              <Skeleton className="h-2 w-2 rounded-full" /> {/* dot */}
              <Skeleton className="h-4 w-24" /> {/* date */}
            </div>

            {/* Body preview */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
