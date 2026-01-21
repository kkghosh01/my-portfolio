import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const projectSchema = z.object({
  /* ---------- Core content ---------- */
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title is too long"),

  slug: z
    .string()
    .min(3)
    .max(150)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and URL-friendly",
    ),

  projectDetails: z.string().min(50, "Project details are too short"),

  category: z.string().min(2).max(30),
  liveUrl: z
    .string()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid project URL",
      },
    ),

  githubUrl: z.string().or(z.literal("")),

  technologies: z.array(z.string().min(1)).default([]),
  features: z.array(z.string().min(1)).default([]),

  /* ---------- SEO ---------- */
  seo: z
    .object({
      metaTitle: z.string().max(60).optional().default(""),
      metaDescription: z.string().max(160).optional().default(""),
    })
    .optional(),

  /* ---------- Publishing ---------- */
  status: z.enum(["draft", "published", "archived"]).default("draft"),

  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  /* ---------- Media ---------- */
  images: z
    .array(z.instanceof(File))
    .max(3, "Maximum 3 images allowed")
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Each image must be less than 1MB",
    })
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      {
        message: "Only jpg, jpeg, png, webp formats are allowed",
      },
    )
    .optional(),
});
