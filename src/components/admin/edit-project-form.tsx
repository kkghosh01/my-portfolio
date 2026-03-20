"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), {
  ssr: false,
});
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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState(
    project.imageUrls ?? [],
  );
  const [existingStorageIds, setExistingStorageIds] = useState<
    Id<"_storage">[]
  >(project.imageStorageIds ?? []);

  const updateProject = useMutation(api.projects.updateProject);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const totalCount =
      existingStorageIds.length + images.length + selectedFiles.length;
    if (totalCount > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const newFiles = [...images, ...selectedFiles];
    const newPreviews = [
      ...imagePreviews,
      ...selectedFiles.map((f) => URL.createObjectURL(f)),
    ];

    setImages(newFiles);
    setImagePreviews(newPreviews);
    e.target.value = ""; // reset input
  }

  function removeNewImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  }

  function removeExistingImage(index: number) {
    setExistingImageUrls(existingImageUrls.filter((_, i) => i !== index));
    setExistingStorageIds(existingStorageIds.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        let finalStorageIds = [...existingStorageIds];

        if (images.length) {
          const newStorageIds = await uploadImages(images, generateUploadUrl);
          finalStorageIds = [...finalStorageIds, ...newStorageIds];
        }

        await updateProject({
          projectId: project._id,
          title,
          projectDetails: details,
          liveUrl,
          category: category || undefined,
          imageStorageIds: finalStorageIds,

          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
        });

        toast.success("Project updated");
        setImages([]);
        setImagePreviews([]);
      } catch {
        toast.error("Update failed");
      }
    });
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="space-y-1">
        <label className="text-sm font-medium">Project Details</label>
        <RichEditor value={details} onChange={(val) => setDetails(val)} />
      </div>
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

      {/* Images Section */}
      <div className="space-y-4">
        <label className="text-sm font-medium">Project Images (Max 3)</label>

        <div className="grid grid-cols-3 gap-4">
          {/* Existing Images */}
          {existingImageUrls.map((url, i) => (
            <div key={`existing-${i}`} className="relative h-32 group">
              <Image src={url} alt="" fill className="object-cover rounded" />
              <button
                type="button"
                onClick={() => removeExistingImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}

          {/* New Image Previews */}
          {imagePreviews.map((url, i) => (
            <div key={`new-${i}`} className="relative h-32 group">
              <Image src={url} alt="" fill className="object-cover rounded" />
              <button
                type="button"
                onClick={() => removeNewImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add More Button */}
          {existingStorageIds.length + images.length < 3 && (
            <label className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer hover:bg-muted transition-colors">
              <span className="text-xs text-muted-foreground">Add Image</span>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      </div>

      <Button disabled={isPending} onClick={handleSubmit}>
        {isPending ? "Saving..." : "Update Project"}
      </Button>
    </div>
  );
}
