import prisma from "@/lib/prisma";
import { formatISO } from "date-fns";

export const getAllGigs = async () => {
  return await prisma.gig.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePicture: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

type CreateGig = {
  title: string;
  description: string;
  budget: number | string;
  deadline: string;
  userId: string;
};

export const createGig = async (input: CreateGig) => {
  return await prisma.gig.create({
    data: {
      title: input.title,
      description: input.description,
      budget: Number(input.budget),
      deadline: formatISO(input.deadline),
      userId: input.userId,
    },
  });
};
