import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(3).max(50).trim(),
  email: z.string(),
  message: z.string().min(3).trim(),
});
