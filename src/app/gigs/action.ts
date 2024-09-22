"use server";
import { createGig, getGigDetails, updateGigStatus } from "@/data-access/gigs";
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
import prisma from "@/lib/prisma";
import { isAfter } from "date-fns";

export const createGigAction = createServerAction()
  .input(createGigSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Please login first");

    if (isAfter(new Date(), input?.deadline)) {
      throw new Error("Invalid Deadline");
    }

    const userBalance = user.wallet?.balance ?? 0;
    if (userBalance < input.budget) {
      throw new Error("Not Enough balance");
    }

    const gig = await createGig({ ...input, userId: user.id });
    revalidatePath("/gigs");
    return gig.id;
  });
