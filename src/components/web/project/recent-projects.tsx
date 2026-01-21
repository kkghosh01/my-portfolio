// components/projects/recent-projects.tsx
import { Suspense } from "react";

import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton";
import { fetchAuthQuery } from "@/lib/auth-server";

import ProjectCard from "../project-card";
import { api } from "../../../../convex/_generated/api";

async function ProjectsContent() {
  const projects = await fetchAuthQuery(api.projects.getRecentProjects, {
    limit: 3,
  });

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}

export function RecentProjects() {
  return (
    <Suspense fallback={<CardGridSkeleton count={3} />}>
      <ProjectsContent />
    </Suspense>
  );
}
