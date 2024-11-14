import prisma from "@/lib/prisma";
import { FileUploadResponse } from "@/types";
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
      files: {
        select: {
          url: true,
          name: true,
          type: true,
          key: true,
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
      files: {
        select: {
          url: true,
          name: true,
          type: true,
          key: true,
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
  files?: FileUploadResponse[] | undefined;
};

export const createGig = async (input: CreateGig) => {
  const { title, description, budget, deadline, userId, files = [] } = input;

  const gig = await prisma.gig.create({
    data: {
      title,
      description,
      budget: Number(budget),
      deadline: new Date(deadline),
      userId,
    },
  });

  if (files.length > 0) {
    await prisma.$transaction(
      files.map((file) =>
        prisma.file.create({
          data: { ...file, gigId: gig.id },
        })
      )
    );
  }

  return gig;
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
