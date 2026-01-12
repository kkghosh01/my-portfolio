import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const postSchema = z.object({
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
      "Slug must be lowercase and URL-friendly"
    ),

  content: z.string().min(50, "Post content is too short"),

  excerpt: z.string().max(200, "Excerpt is too long").optional(),

  /* ---------- Taxonomy ---------- */
  tags: z
    .array(
      z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-z0-9.-]+$/, "Invalid tag format")
    )
    .min(1, "At least one tag is required")
    .max(5, "Maximum 5 tags allowed"),

  category: z.string().min(2).max(30),

  /* ---------- SEO ---------- */
  seo: z
    .object({
      metaTitle: z.string().max(60).optional(),
      metaDescription: z.string().max(160).optional(),
    })
    .optional(),

  /* ---------- Publishing ---------- */
  status: z.enum(["draft", "published", "archived"]).optional(),

  publishedAt: z.date().optional(),

  /* ---------- Media ---------- */
  coverImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 1MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
});
