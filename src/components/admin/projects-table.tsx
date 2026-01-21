"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { publishProjectAction } from "@/app/actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

/* ---------- types ---------- */

type Project = {
  _id: Id<"projects">;
  title: string;
  status: "draft" | "published" | "archived";
  category?: string;
  liveUrl: string;
  createdAtFormatted: string;
  imageUrls?: string[] | null; // resolved from storage
};

/* ---------- component ---------- */

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const [localProjects, setLocalProjects] = useState(projects);
  const [selected, setSelected] = useState<Set<Id<"projects">>>(new Set());
  const [pendingId, setPendingId] = useState<Id<"projects"> | null>(null);
  const [isPending, startTransition] = useTransition();

  const publishProject = useMutation(api.projects.publishProject);
  const archiveProject = useMutation(api.projects.archiveProject);

  /* ---------- helpers ---------- */

  function toggleSelect(id: Id<"projects">) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function optimisticStatus(
    projectId: Id<"projects">,
    status: Project["status"]
  ) {
    setLocalProjects((prev) =>
      prev.map((p) => (p._id === projectId ? { ...p, status } : p))
    );
  }

  /* ---------- publish single ---------- */

  async function handlePublish(projectId: Id<"projects">) {
    setPendingId(projectId);
    optimisticStatus(projectId, "published");

    try {
      await publishProject({ projectId });
      await publishProjectAction(projectId); // revalidate pages
      toast.success("Project published");
    } catch {
      setLocalProjects(projects);
      toast.error("Publish failed");
    } finally {
      setPendingId(null);
    }
  }

  /* ---------- bulk publish ---------- */

  async function handleBulkPublish() {
    const ids = Array.from(selected);

    startTransition(async () => {
      try {
        ids.forEach((id) => optimisticStatus(id, "published"));
        await Promise.all(ids.map((id) => publishProject({ projectId: id })));
        await Promise.all(ids.map((id) => publishProjectAction(id)));
        toast.success(`${ids.length} projects published`);
        setSelected(new Set());
      } catch {
        setLocalProjects(projects);
        toast.error("Bulk publish failed");
      }
    });
  }

  /* ---------- archive ---------- */

  async function handleArchive(projectId: Id<"projects">) {
    const ok = confirm("Are you sure you want to archive this project?");
    if (!ok) return;

    optimisticStatus(projectId, "archived");

    try {
      await archiveProject({ projectId });
      toast.success("Project archived");
    } catch {
      setLocalProjects(projects);
      toast.error("Archive failed");
    }
  }

  /* ---------- UI ---------- */

  return (
    <>
      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <Button size="sm" disabled={isPending} onClick={handleBulkPublish}>
            Publish selected ({selected.size})
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {localProjects.map((project) => (
            <TableRow key={project._id}>
              <TableCell>
                <Checkbox
                  checked={selected.has(project._id)}
                  onCheckedChange={() => toggleSelect(project._id)}
                />
              </TableCell>

              <TableCell>
                {project.imageUrls?.[0] ? (
                  <div className="relative h-20 w-32 overflow-hidden rounded-lg">
                    <Image
                      src={project.imageUrls[0]}
                      alt={project.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="font-medium">{project.title}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    project.status === "published"
                      ? "default"
                      : project.status === "draft"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </TableCell>

              <TableCell>{project.category ?? "—"}</TableCell>
              <TableCell>{project.createdAtFormatted}</TableCell>

              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/projects/${project._id}`}>Edit</Link>
                </Button>

                {project.status === "draft" && (
                  <Button
                    size="sm"
                    disabled={pendingId === project._id}
                    onClick={() => handlePublish(project._id)}
                  >
                    {pendingId === project._id ? "Publishing…" : "Publish"}
                  </Button>
                )}

                {project.status !== "archived" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleArchive(project._id)}
                  >
                    Archive
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
