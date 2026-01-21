// app/projects/[slug]/page.tsx
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { api } from "../../../../../convex/_generated/api";
import { User, Calendar, ExternalLink, Github } from "lucide-react";
import { ImageGallery } from "@/components/web/ImageGallery";
// import { ImageGallery } from "@/components/ImageGallery";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getProjectBySlug, {
    slug,
  });

  if (!project) notFound();

  return (
    <article className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight tracking-tight">
                {project.title}
              </h1>

              {/* <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
                {project.tagline || "An innovative project showcasing modern development practices"}
              </p> */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-semibold text-gray-900 dark:text-white">
                  {project.authorName}
                </span>
                <span className="text-sm">Author</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-700" />

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <time
                  dateTime={new Date(project._creationTime).toISOString()}
                  className="block font-semibold text-gray-900 dark:text-white"
                >
                  {new Date(project._creationTime).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span className="text-sm">Published</span>
              </div>
            </div>

            {/* Tech Stack Tags */}
            {project.technologies && project.technologies.length > 0 && (
              <>
                <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-700" />
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Image Gallery */}
        <ImageGallery images={project.imageUrls} title={project.title} />

        {/* Content */}
        <div className="mt-10 sm:mt-12 lg:mt-16">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Project Overview
              </h2>

              <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed text-lg">
                  {project.projectDetails}
                </p>

                {project.features && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Key Features
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-4 bg-linear-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Visit Live Project</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 dark:bg-gray-800"
                >
                  <Github className="w-5 h-5" />
                  <span>Explore Source Code</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
