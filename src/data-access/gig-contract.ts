import { ADMIN_USER_ID } from "@/constants";
import prisma from "@/lib/prisma";
import { GIG_CONTRACT_STATUS } from "@prisma/client";
import { decrementWalletBalance, incrementWalletBalance } from "./wallets";

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
  });

  /** 
    Deduct the agreed price to the client's wallet and send it to the admin's wallet
  */
  await decrementWalletBalance({ userId: input.clientId, amount: input.price });
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
