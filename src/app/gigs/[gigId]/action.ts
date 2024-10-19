"use server";
import { getGigStatus, updateGigStatus } from "@/data-access/gigs";
import {
  applyToGig,
  getApplicanttionStatus,
  getApplicationDetail,
  removeApplication,
  updateApplicationStatus,
} from "@/data-access/gig-applicants";
import { getCurrentUser } from "@/lib/sessions";
import { createGigApplicationSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerAction } from "zsa";
import {
  createGigContract,
  getContractDetails,
  updateContractStatus,
} from "@/data-access/gig-contract";
import {
  ADMIN_USER_ID,
  ADMIN_WALLET_ID,
  MINIMUM_GIG_PRICE,
  TAX_RATE,
} from "@/constants";
import prisma from "@/lib/prisma";
import { isAfter } from "date-fns";
import {
  decrementWalletBalance,
  incrementWalletBalance,
} from "@/data-access/wallets";
import { createTransaction } from "@/data-access/transactions";

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
      const { applicationId } = input;

      const application = await getApplicanttionStatus(applicationId);
      if (!application) throw new Error("Application not found");
      if (application.status === "ACCEPTED") {
        throw new Error(
          "Application is already accepted, please reload the page."
        );
      }

      const res = await removeApplication({ applicationId });

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

export const confirmTransactionAction = createServerAction()
  .input(
    z.object({
      gigId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const gig = await prisma.gig.findUnique({
      where: { id: input.gigId },
      select: {
        id: true,
        status: true,
        contract: {
          select: {
            id: true,
            freelancer: { include: { wallet: { select: { id: true } } } },
            price: true,
          },
        },
      },
    });

    if (!gig) {
      throw new Error("Gig not found");
    }

    if (!gig.contract) {
      throw new Error("There is no contract for this gig");
    }

    if (gig?.status !== "ONGOING") {
      throw new Error(`An error occurred, GIG is ${gig?.status}`);
    }

    const tax = gig.contract.price * TAX_RATE;
    const totalAmount = gig.contract.price - tax;

    await prisma.$transaction([
      prisma.gig.update({
        where: { id: input.gigId },
        data: { status: "DONE" },
      }),
      prisma.gigContract.update({
        where: { id: gig.contract.id },
        data: { status: "DONE" },
      }),
      // Transfer the money from the admin wallet to the freelancer wallet
      prisma.wallet.update({
        where: { userId: ADMIN_USER_ID },
        data: { balance: { decrement: totalAmount } },
      }),
      // Increment the freelancer wallet balance
      prisma.wallet.update({
        where: { userId: gig.contract.freelancer.id },
        data: { balance: { increment: totalAmount } },
      }),
    ]);

    // Create a transaction receipt for the freelancer
    await createTransaction({
      description: "Received payment for gig",
      amount: gig.contract.price - tax,
      type: "DEBIT",
      status: "SUCCESS",
      walletId: gig.contract.freelancer.wallet!.id,
    });

    // Create a transaction receipt for the admin
    await createTransaction({
      description: "Tax for gig",
      amount: tax,
      type: "DEBIT",
      status: "SUCCESS",
      walletId: ADMIN_WALLET_ID,
    });

    revalidatePath(`/gigs/${input.gigId}`);
  });
