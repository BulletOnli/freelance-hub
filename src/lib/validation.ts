import { MINIMUM_GIG_PRICE } from "@/constants";
import { z } from "zod";

const requiredString = z.string().min(2);
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(20);

export const profilePicSchema = z
  .instanceof(File, { message: "Image is required" })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
    { message: "Only .jpg, .png and .gif formats are supported" }
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB",
  });

const baseSignUpSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  email: z.string().email(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  profilePicture: z.string().url(),
});

export const freelancerSchema = baseSignUpSchema
  .extend({
    bio: requiredString,
    specialization: z.string().array().min(1).max(5),
    portfolio: z.string().url(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

export const studentSignUpSchema = baseSignUpSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  }
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters is required"),
});

export const createGigSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  budget: z
    .number()
    .min(MINIMUM_GIG_PRICE, "Budget is required")
    .refine((val) => !isNaN(val), {
      message: "Budget must be a valid number",
    }),
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Deadline must be a valid date",
    }),
});

export const createGigApplicationSchema = z.object({
  price: z.number().min(MINIMUM_GIG_PRICE, "Price is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  portfolio: z.string().url("Invalid URL"),
  gigId: z.string().min(1),
});
