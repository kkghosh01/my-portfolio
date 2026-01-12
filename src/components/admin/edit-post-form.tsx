"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postSchema } from "@/app/schemas/blog";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const postFormSchema = postSchema.partial({ coverImage: true });
type PostFormValues = z.infer<typeof postFormSchema>;

type EditPostFormProps = {
  post: PostFormValues;
  postId: Id<"posts">;
  status: "draft" | "published" | "archived";
  imageStorageId?: Id<"_storage">;
  imageUrl?: string | null;
};

export default function EditPostForm({
  post,
  postId,
  status,
  imageStorageId,
  imageUrl,
}: EditPostFormProps) {
  const router = useRouter();

  const updatePost = useMutation(api.posts.updatePost);
  const publishPost = useMutation(api.posts.publishPost);
  const archivePost = useMutation(api.posts.archivePost);
  const deleteImage = useMutation(api.posts.deleteImage);
  const generateUploadUrl = useMutation(api.posts.generateImageUploadUrl);

  const [preview, setPreview] = useState<string | null>(imageUrl ?? null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema) as any,
    defaultValues: post,
  });

  /* ---------------- SAVE ---------------- */
  async function onSave(values: PostFormValues) {
    try {
      let newStorageId = undefined;

      // 🔁 upload new image if changed
      if (newImage) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": newImage.type },
          body: newImage,
        });

        const { storageId } = await res.json();
        newStorageId = storageId;

        // 🗑 delete old image
        if (imageStorageId) {
          await deleteImage({ storageId: imageStorageId });
        }
      }

      await updatePost({
        postId,
        title: values.title,
        slug: values.slug,
        content: values.content,
        tags: values.tags,
        category: values.category || undefined,
        excerpt: values.excerpt || undefined,
        seoTitle: values.seo?.metaTitle,
        seoDescription: values.seo?.metaDescription,
        imageStorageId: newStorageId,
      });

      toast.success("Post saved");
      form.reset(values);
    } catch {
      toast.error("Update failed");
    }
  }

  /* ---------------- PUBLISH ---------------- */
  async function onPublish() {
    try {
      await publishPost({ postId });
      toast.success("Post published");
      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      toast.error("Publish failed");
    }
  }

  /* ---------------- ARCHIVE ---------------- */
  async function onArchive() {
    if (!confirm("Archive this post?")) return;

    try {
      await archivePost({ postId });
      toast.success("Post archived");
      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      toast.error("Archive failed");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Post</h1>

        {/* -------- IMAGE -------- */}
        <div>
          <FormLabel>Cover Image</FormLabel>

          {preview && (
            <img
              src={preview}
              className="h-48 w-full object-cover rounded-lg mb-3"
            />
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setNewImage(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {/* -------- TEXT FIELDS -------- */}
        {["title", "slug", "category"].map((name) => (
          <FormField
            key={name}
            name={name as any}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <Textarea rows={10} {...field} />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit">Save</Button>

          {status === "draft" && (
            <Button type="button" onClick={onPublish}>
              Publish
            </Button>
          )}

          {status !== "archived" && (
            <Button type="button" variant="destructive" onClick={onArchive}>
              Archive
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
