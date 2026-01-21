import { fetchAuthQuery } from "@/lib/auth-server";
import EditProjectForm from "@/components/admin/edit-project-form";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const { id } = await params;
  const project = await fetchAuthQuery(api.projects.getProjectById, {
    projectId: (await params).id as Id<"projects">,
  });

  if (!project) notFound();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <EditProjectForm project={project} />
    </div>
  );
}
