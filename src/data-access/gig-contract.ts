import { ADMIN_USER_ID } from "@/constants";
import prisma from "@/lib/prisma";

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
  await prisma.wallet.update({
    where: { userId: input.clientId },
    data: { balance: { decrement: input.price } },
  });

  await prisma.wallet.update({
    where: { userId: ADMIN_USER_ID },
    data: { balance: { increment: input.price } },
  });

  return contract;
};
