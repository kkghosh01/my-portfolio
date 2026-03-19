import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  project: {
    _id: string;
    title: string;
    slug: string;
    imageUrls?: string[] | null;
    projectDetails: string;
  };
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const image =
    project.imageUrls?.[0] ||
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085";

  // Helper to strip HTML tags for the preview
  const stripHtml = (html: string) => {
    if (!html) return "";
    // 1. Remove script and style tags and their content
    const doc = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    // 2. Remove all other HTML tags
    const clean = doc.replace(/<[^>]*>?/gm, " ");
    // 3. Decode common entities and normalize whitespace
    return clean
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <article className="group">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            quality={75}
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {stripHtml(project.projectDetails)}
        </p>
      </Link>
    </article>
  );
}
