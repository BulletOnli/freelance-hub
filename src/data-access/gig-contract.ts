import prisma from "@/lib/prisma";

type CreateGigContract = {
  gigId: string;
  freelancerId: string;
  clientId: string;
  price: number;
  startDate: Date;
  endDate: Date;
};

export const createGigContract = async (input: CreateGigContract) => {
  return await prisma.gigContract.create({
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
};
