import { MINIMUM_GIG_PRICE } from "@/constants";
import { UserRole } from "@prisma/client";
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

export const onboardingSchema = z
  .object({
    role: z
      .enum([UserRole.CLIENT, UserRole.FREELANCER])
      .default(UserRole.CLIENT),
    bio: z.string().optional(),
    portfolio: z.string().url().optional(),
    specialization: z.array(z.string()).max(5).optional(),
  })
  .superRefine((data, ctx) => {
    const freelancerFields = {
      bio: "Bio is required",
      portfolio: "Portfolio is required",
      specialization: "Specialization is required",
    };

    // Only validate if role is FREELANCER
    if (data.role === UserRole.FREELANCER) {
      Object.entries(freelancerFields).forEach(([key, errorMessage]) => {
        if (!data[key as keyof typeof data]) {
          ctx.addIssue({
            code: "custom",
            message: errorMessage,
            path: [key],
          });
        }
      });

      // Check for specialization length
      if (!data.specialization || data.specialization.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: freelancerFields.specialization,
          path: ["specialization"],
        });
      }
    }
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
