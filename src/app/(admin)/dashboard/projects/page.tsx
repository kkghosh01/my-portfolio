// app/dashboard/projects/page.tsx
import { fetchAuthQuery } from "@/lib/auth-server";

import ProjectsTable from "@/components/admin/projects-table";
import { api } from "../../../../../convex/_generated/api";

export default async function AdminProjectsPage() {
  const projects = await fetchAuthQuery(api.projects.getAdminProjects, {});

  const formattedProjects = projects.map((project) => ({
    ...project,
    createdAtFormatted: new Date(project.createdAt).toISOString().slice(0, 10),
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      <ProjectsTable projects={formattedProjects} />
    </div>
  );
}
