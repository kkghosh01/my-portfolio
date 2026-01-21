"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { uploadImages } from "@/lib/upload-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Id } from "../../../convex/_generated/dataModel";

type Project = {
  _id: Id<"projects">;
  title: string;
  projectDetails: string;
  category?: string;
  liveUrl: string;
  imageUrls?: string[] | null;
  imageStorageIds?: Id<"_storage">[];
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published" | "archived";
};

export default function EditProjectForm({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(project.title);
  const [details, setDetails] = useState(project.projectDetails);
  const [category, setCategory] = useState(project.category ?? "");
  const [liveUrl, setLiveUrl] = useState(project.liveUrl);

  const [seoTitle, setSeoTitle] = useState(project.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    project.seoDescription ?? "",
  );

  const [images, setImages] = useState<File[]>([]);
  const [existingImages] = useState(project.imageUrls ?? []);

  const updateProject = useMutation(api.projects.updateProject);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  function handleSubmit() {
    startTransition(async () => {
      try {
        let imageStorageIds = project.imageStorageIds;

        if (images.length) {
          imageStorageIds = await uploadImages(images, generateUploadUrl);
        }

        await updateProject({
          projectId: project._id,
          title,
          projectDetails: details,
          liveUrl,
          category: category || undefined,
          imageStorageIds,

          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
        });

        toast.success("Project updated");
      } catch (err) {
        toast.error("Update failed");
      }
    });
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
        rows={8}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <Input value={category} onChange={(e) => setCategory(e.target.value)} />
      <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />

      <Input
        placeholder="SEO title"
        value={seoTitle}
        onChange={(e) => setSeoTitle(e.target.value)}
      />
      <Textarea
        rows={3}
        placeholder="SEO description"
        value={seoDescription}
        onChange={(e) => setSeoDescription(e.target.value)}
      />

      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {existingImages.map((url, i) => (
            <div key={i} className="relative h-32">
              <Image src={url} alt="" fill className="object-cover rounded" />
            </div>
          ))}
        </div>
      )}

      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files ?? []))}
      />

      <Button disabled={isPending} onClick={handleSubmit}>
        {isPending ? "Saving..." : "Update Project"}
      </Button>
    </div>
  );
}
