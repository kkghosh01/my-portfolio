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

  return (
    <article className="group">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {project.projectDetails}
        </p>
      </Link>
    </article>
  );
}
