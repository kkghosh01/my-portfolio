import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { notFound } from "next/navigation";
// import { incrementView } from "@/lib/increment-view";
import type { Metadata } from "next";
import { api } from "../../../../../convex/_generated/api";
import { incrementView } from "@/lib/increment-view";
import { LikeButton } from "@/components/web/likeButton";
import Link from "next/link";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

/* -------------------- SEO METADATA -------------------- */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getPostBySlug, {
    slug,
  });

  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.excerpt || post.content.slice(0, 150),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
    },

    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

/* -------------------- PAGE -------------------- */
export default async function BlogDetails({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getPostBySlug, {
    slug,
  });

  if (!post || post.status !== "published") {
    notFound();
  }

  // fire & forget view count
  //   incrementView(post._id);
  incrementView(post._id);

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mb-8 transition-colors group"
      >
        <svg
          className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Blog
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
              <User className="w-4 h-4" />
            </div>
            <span className="font-medium">{post.authorName}</span>
          </div>

          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />

          <time
            dateTime={new Date(post._creationTime).toISOString()}
            className="flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(post._creationTime).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {post.imageUrl && (
        <div className="relative h-96 mb-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
        </div>
      )}

      <div
        className="prose prose-lg dark:prose-invert max-w-none 
    prose-headings:font-semibold
    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
    prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
    prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
    prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
    prose-blockquote:pl-4 prose-blockquote:italic
    prose-ul:my-6 prose-ol:my-6
    prose-li:my-2
    prose-hr:my-12 prose-hr:border-gray-200 dark:prose-hr:border-gray-700
    mb-12"
      >
        {post.content}
      </div>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
        <LikeButton postId={post._id} initialLikes={post.likes ?? 0} />
      </div>
    </article>
  );
}
