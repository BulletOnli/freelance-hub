"use server";
import { updateGigStatus } from "@/data-access/gigs";
import {
  applyToGig,
  updateApplicationStatus,
} from "@/data-access/gig-applicants";
import { getCurrentUser } from "@/lib/sessions";
import { createGigApplicationSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerAction } from "zsa";
import { createGigContract } from "@/data-access/gig-contract";
import { MINIMUM_GIG_PRICE } from "@/constants";
import prisma from "@/lib/prisma";
import { isAfter } from "date-fns";

export const applyToGigAction = createServerAction()
  .input(createGigApplicationSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Please login first");

    try {
      const gig = await prisma.gig.findUnique({
        where: { id: input.gigId },
        select: {
          budget: true,
          status: true,
          deadline: true,
        },
      });

      if (!gig) throw new Error("Gig not found");

      const isPastDeadline = isAfter(new Date(), gig?.deadline);
      if (isPastDeadline) {
        throw new Error("Gig has expired");
      }

      if (gig.status !== "AVAILABLE") {
        throw new Error(`Gig is ${gig.status}`);
      }

      if (input.price > gig.budget) {
        throw new Error(`The client budget is only ${gig.budget}.`);
      }

      await applyToGig({
        ...input,
        freelancerId: user.id,
      });

      revalidatePath(`/gigs/${input.gigId}`);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("You've already applied for this Gig.");
        }
      }

      throw error;
    }
  });

export const acceptApplicationAction = createServerAction()
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

export const removeApplicationAction = createServerAction()
  .input(
    z.object({
      applicationId: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    try {
      const res = await prisma.gigApplicant.delete({
        where: {
          id: input?.applicationId,
        },
      });

      revalidatePath(`/gigs/${res?.gigId}`);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("Gig is already ongoing");
        }
      }

      throw error;
    }
  });
