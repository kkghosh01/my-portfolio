import Image from "next/image";
import Link from "next/link";

type PostCardProps = {
  post: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const image =
    post.imageUrl ??
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085";

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
          {post.title}
        </h3>

        {post.content && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {post.content}
          </p>
        )}
      </Link>
    </article>
  );
}
