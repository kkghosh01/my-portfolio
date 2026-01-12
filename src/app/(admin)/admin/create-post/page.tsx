"use client";

import { postSchema } from "@/app/schemas/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { createBlogAction } from "@/app/actions";
import { useTransition } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreatePostPage() {
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      tags: [],
      category: "",
      status: "draft",
      coverImage: undefined,
    },
  });

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImagePreview(null);
      form.setValue("coverImage", undefined as any);
      return;
    }

    // Client-side validation
    const MAX_SIZE = 1024 * 1024; // 1MB
    const ACCEPTED_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    // Check file size
    if (file.size > MAX_SIZE) {
      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
      const errorMsg = `Image size (${sizeInMB}MB) exceeds 1MB limit`;
      setImageError(errorMsg);

      toast.error("Image too large", {
        description: "Please upload an image smaller than 1MB",
      });

      e.target.value = "";
      setImagePreview(null);
      form.setValue("coverImage", undefined as any);
      return;
    }

    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, WebP, and AVIF formats are supported");

      toast.error("Invalid image format", {
        description: "Please upload a JPG, PNG, WebP, or AVIF image",
      });

      e.target.value = "";
      setImagePreview(null);
      form.setValue("coverImage", undefined as any);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Update form
    form.setValue("coverImage", file);
  }

  function onSubmit(values: z.infer<typeof postSchema>) {
    startTransition(async () => {
      await createBlogAction(values);
    });
  }
  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Create New Post
        </h1>
        <p className="text-xl text-muted-foreground mt-4">
          Share your thoughts with the world.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
          <CardDescription>
            Fill in the details below to publish a new post.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title *</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="My First Blog Post"
                      type="text"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!slugTouched) {
                          form.setValue("slug", slugify(e.target.value));
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Slug *</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="my-first-blog-post"
                      type="text"
                      {...field}
                      onChange={(e) => {
                        setSlugTouched(true);
                        field.onChange(e);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content *</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your blog post here..."
                      rows={10}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="excerpt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Excerpt(Optional)</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your blog post excerpt here..."
                      rows={5}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Tags *</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. technology, programming"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .toLowerCase()
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Category *</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. technology, programming"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* <Controller
                name="coverImage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Cover Image</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. technology, programming"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              /> */}

              <Controller
                name="coverImage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Cover Image *</FieldLabel>

                    {imagePreview && (
                      <div className="mb-4">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden border">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            JPG, PNG, WebP, AVIF (MAX. 1MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e);
                          }}
                        />
                      </label>
                    </div>

                    {imageError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{imageError}</AlertDescription>
                      </Alert>
                    )}

                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Button
                disabled={isPending || !!imageError}
                type="submit"
                className="mt-4"
              >
                {isPending ? (
                  <>
                    <Loader2 size="sm" />
                    <span className="ml-2">Creating...</span>
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
