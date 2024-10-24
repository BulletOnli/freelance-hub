import { ADMIN_USER_ID, ADMIN_WALLET_ID, TAX_RATE } from "@/constants";
import prisma from "@/lib/prisma";
import { GIG_CONTRACT_STATUS } from "@prisma/client";
import { decrementWalletBalance, incrementWalletBalance } from "./wallets";
import { createTransaction } from "./transactions";

export const getAllContracts = async (
  status?: GIG_CONTRACT_STATUS,
  userId?: string
) => {
  return await prisma.gigContract.findMany({
    where: {
      status,
      ...(userId && {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      }),
    },
    include: {
      gig: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
  });
};

type CreateGigContract = {
  gigId: string;
  freelancerId: string;
  clientId: string;
  price: number;
  startDate: Date;
  endDate: Date;
};

export const getContractDetails = async (gigId: string) => {
  const contract = await prisma.gigContract.findFirst({
    where: { gigId },
    include: {
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePicture: true,
        },
      },
      freelancer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePicture: true,
        },
      },
    },
  });

  return contract;
};

export const createGigContract = async (input: CreateGigContract) => {
  const contract = await prisma.gigContract.create({
    data: {
      gigId: input.gigId,
      freelancerId: input.freelancerId,
      clientId: input.clientId,
      status: "ONGOING",
      price: input.price,
      startDate: input.startDate || new Date(),
      endDate: input.endDate || new Date(),
    },
    include: {
      client: {
        include: { wallet: { select: { id: true } } },
      },
    },
  });

  // Deduct the amount from the client's wallet
  await decrementWalletBalance({ userId: input.clientId, amount: input.price });
  // Create a transaction receipt for the client
  await createTransaction({
    gigContractId: contract.id,
    description: "Payment for gig",
    amount: input.price,
    type: "CREDIT",
    status: "SUCCESS",
    walletId: contract.client.wallet!.id,
  });

  // Increment the amount to the ADMIN's wallet
  await incrementWalletBalance({ userId: ADMIN_USER_ID, amount: input.price });

  return contract;
};

export const updateContractStatus = async ({
  contractId,
  status,
}: {
  contractId: string;
  status: GIG_CONTRACT_STATUS;
}) => {
  return await prisma.gigContract.update({
    where: { id: contractId },
    data: { status },
  });
};
