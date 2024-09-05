import { z } from "zod";

const requiredString = z.string().min(2);

export const profilePicSchema = z
  .instanceof(File, { message: "Image is required" })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
    {
      message: "Only .jpg, .png and .gif formats are supported",
    }
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB",
  });

export const signUpSchema = z
  .object({
    username: requiredString,
    firstName: requiredString,
    lastName: requiredString,
    email: requiredString.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20),
    bio: requiredString,
    specialization: z.string().array().min(1).max(5),
    portfolio: z.string().url(),
    profilePicture: z.string().url(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters is required"),
});
