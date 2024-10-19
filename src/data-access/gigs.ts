import prisma from "@/lib/prisma";
import { GIG_STATUS } from "@prisma/client";

export const getAllGigs = async (status?: GIG_STATUS) => {
  return await prisma.gig.findMany({
    where: { status, deadline: { gte: new Date() } },
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
      applicants: {
        include: {
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
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getGigDetails = async (gigId: string) => {
  return await prisma.gig.findUnique({
    where: {
      id: gigId,
    },
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
      applicants: {
        include: {
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
      },
    },
  });
};

export const getGigStatus = async (gigId: string) => {
  return await prisma.gig.findUnique({
    where: { id: gigId },
    select: { id: true, status: true },
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
      deadline: new Date(input.deadline),
      userId: input.userId,
    },
  });
};

export const updateGigStatus = async ({
  gigId,
  status,
}: {
  gigId: string;
  status: GIG_STATUS;
}) => {
  return await prisma.gig.update({
    where: {
      id: gigId,
    },
    data: { status },
  });
};
