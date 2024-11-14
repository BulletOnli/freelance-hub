import { MINIMUM_GIG_PRICE } from "@/constants";
import { UserRole } from "@prisma/client";
import { z } from "zod";

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
  files: z
    .array(
      z.object({
        url: z.string(),
        type: z.string(),
        key: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

export const createGigApplicationSchema = z.object({
  price: z.number().min(MINIMUM_GIG_PRICE, "Price is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  portfolio: z.string().url("Invalid URL"),
  gigId: z.string().min(1),
});
