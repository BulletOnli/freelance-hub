import { z } from "zod";

const requiredString = z.string().min(2);

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
    portfolio: requiredString.url(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });
