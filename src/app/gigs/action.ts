"use server";
import { createGig, updateGigStatus } from "@/data-access/gigs";
import {
  applyToGig,
  updateApplicationStatus,
} from "@/data-access/gig-applicants";
import { getCurrentUser } from "@/lib/sessions";
import { createGigApplicationSchema, createGigSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerAction } from "zsa";
import { createGigContract } from "@/data-access/gig-contract";
import { MINIMUM_GIG_PRICE } from "@/constants";

export const createGigAction = createServerAction()
  .input(createGigSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Please login first");

    const gig = await createGig({ ...input, userId: user.id });
    revalidatePath("/gigs");
    return gig.id;
  });

export const applyToGigAction = createServerAction()
  .input(createGigApplicationSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Please login first");

    try {
      await applyToGig({
        ...input,
        freelancerId: user.id,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("You've already applied for this Gig.");
        }
      }

      throw error;
    }
  });

export const acceptApplicationStatusAction = createServerAction()
  .input(
    z.object({
      gigId: z.string().min(1),
      applicationId: z.string().min(1),
      freelancerId: z.string().min(1),
      clientId: z.string().min(1),
      price: z.number().min(MINIMUM_GIG_PRICE),
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .handler(async ({ input }) => {
    const {
      applicationId,
      gigId,
      clientId,
      freelancerId,
      price,
      endDate,
      startDate,
    } = input;
    try {
      const response = await Promise.all([
        updateApplicationStatus({ applicationId, status: "ACCEPTED" }),
        updateGigStatus({ gigId, status: "ONGOING" }),
        createGigContract({
          clientId,
          endDate,
          freelancerId,
          gigId,
          price,
          startDate,
        }),
      ]);

      revalidatePath(`/gigs/${response[1].id}`);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("Gig is already ongoing");
        }
      }

      throw error;
    }
  });