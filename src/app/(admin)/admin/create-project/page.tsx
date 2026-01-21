"use client";

import { createProjectAction } from "@/app/actions";
import { projectSchema } from "@/app/schemas/projectSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImages } from "@/lib/upload-images";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function CreateProjectPage() {
  const [isPending, startTransition] = useTransition();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const router = useRouter();
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      projectDetails: "",
      category: "",
      liveUrl: "",
      githubUrl: "",
      technologies: [],
      features: [],
      status: "draft",
      images: [],
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
    const files = Array.from(e.target.files || []);
    setImageError(null);

    if (files.length === 0) {
      setImagePreviews([]);
      form.setValue("images", []);
      return;
    }

    if (files.length > 3) {
      setImageError("Maximum 3 images allowed");
      toast.error("Too many images", {
        description: "You can upload up to 3 images.",
      });
      return;
    }

    const MAX_SIZE = 1024 * 1024; // 1MB
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        setImageError(`${file.name} is too large (max 1MB)`);
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file)); // FileReader
    }

    setImagePreviews(previews);
    form.setValue("images", validFiles);
  }
  function onSubmit(values: z.infer<typeof projectSchema>) {
    startTransition(async () => {
      let storageIds: string[] = [];

      if (values.images?.length) {
        storageIds = await uploadImages(values.images, () =>
          generateUploadUrl(),
        );
      }

      const res = await createProjectAction({
        title: values.title,
        slug: values.slug,
        projectDetails: values.projectDetails,
        category: values.category,
        liveUrl: values.liveUrl,
        githubUrl: values.githubUrl,
        technologies: values.technologies,
        features: values.features,
        imageStorageIds: storageIds as any,
        seoTitle: values.seo?.metaTitle,
        seoDescription: values.seo?.metaDescription,
      });

      if (res.success) {
        toast.success("Project created successfully!");
        router.push("/dashboard/projects");
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Create Project
        </h1>
        <p className="text-xl text-muted-foreground mt-4">
          Create a new project by filling out the form below.
        </p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create Project Form</CardTitle>
          <CardDescription>
            Fill in the details for your new project.
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
                name="projectDetails"
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
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Category *</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. E-Commerce, Portfolio, Blog"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="liveUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Live URL *</FieldLabel>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      inputMode="url"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="githubUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>GitHub URL</FieldLabel>
                    <Input
                      type="url"
                      placeholder="https://github.com/username/repo"
                      inputMode="url"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="technologies"
                control={form.control}
                render={({ field, fieldState }) => {
                  const [inputValue, setInputValue] = useState(
                    Array.isArray(field.value) ? field.value.join(", ") : "",
                  );

                  return (
                    <Field>
                      <FieldLabel>Technologies (comma-separated)</FieldLabel>
                      <Input
                        placeholder="React, Next.js, TypeScript"
                        value={inputValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInputValue(val);
                          const arrayValues = val
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean);
                          field.onChange(arrayValues);
                        }}
                        onBlur={() => {
                          const formatted = (
                            Array.isArray(field.value) ? field.value : []
                          ).join(", ");
                          setInputValue(formatted);
                          field.onBlur();
                        }}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="features"
                control={form.control}
                render={({ field, fieldState }) => {
                  const [featureInput, setFeatureInput] = useState(
                    Array.isArray(field.value) ? field.value.join(", ") : "",
                  );

                  return (
                    <Field>
                      <FieldLabel>Features (comma-separated)</FieldLabel>
                      <Input
                        {...field}
                        value={featureInput}
                        placeholder="Authentication, SEO, Dashboard"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFeatureInput(val);

                          const arrayValues = val
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean);
                          field.onChange(arrayValues);
                        }}
                        onBlur={() => {
                          const formatted = (
                            Array.isArray(field.value) ? field.value : []
                          ).join(", ");
                          setFeatureInput(formatted);
                          field.onBlur();
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="images"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Project Images (Max 3) *</FieldLabel>

                    {/* Multiple Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {imagePreviews.map((src, index) => (
                          <div
                            key={index}
                            className="relative h-32 rounded-lg overflow-hidden border"
                          >
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const currentImages =
                                  form.getValues("images") || [];

                                const newFiles = currentImages.filter(
                                  (_, i) => i !== index,
                                );
                                const newPreviews = imagePreviews.filter(
                                  (_, i) => i !== index,
                                );

                                setImagePreviews(newPreviews);
                                form.setValue("images", newFiles);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload multiple
                            </span>
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    {imageError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{imageError}</AlertDescription>
                      </Alert>
                    )}
                  </Field>
                )}
              />

              <Button
                disabled={isPending || !!imageError}
                type="submit"
                className="w-full mt-6"
              >
                {isPending ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Create Project"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
