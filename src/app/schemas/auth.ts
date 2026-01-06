import z from "zod";
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be under 30 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  email: z.email({ message: "Invalid email address" }).toLowerCase(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(30, { message: "Password must be under 30 characters" })
    .regex(/[A-Z]/, { message: "Must include one uppercase letter" })
    .regex(/[a-z]/, { message: "Must include one lowercase letter" })
    .regex(/[0-9]/, { message: "Must include one number" })
    .regex(/[@$!%*?&]/, { message: "Must include one special character" }),
});
