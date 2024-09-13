import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import argon2 from "argon2";
import { createInstantWallet } from "./wallet";

export const getLoggedInUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      wallet: true,
    },
  });
};

export const validateLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user || !user.password) {
    return null;
  }

  const isValid = await argon2.verify(user.password, password);

  if (isValid) {
    return user?.id;
  } else {
    return null;
  }
};

export const isEmailAlreadyTaken = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email }],
    },
    select: {
      id: true,
      email: true,
    },
  });
};

export const createFreelancerUser = async (input: {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  portfolio: string;
  email: string;
  password: string;
  specialization: string[];
  profilePicture: string;
}) => {
  const user = await prisma.user.create({
    data: {
      id: input.id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      profilePicture: input.profilePicture,
      role: "FREELANCER",
    },
  });

  await prisma.userDetails.create({
    data: {
      userId: user.id,
      bio: input.bio,
      portfolio: input.portfolio,
      specialization: input.specialization,
    },
  });

  await createInstantWallet(user.id);
};

export const createClientUser = async (input: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
}) => {
  const user = await prisma.user.create({
    data: {
      id: input.id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      profilePicture: input.profilePicture,
      role: "CLIENT",
    },
  });

  await createInstantWallet(user.id);
};

export const getUserDetails = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
    include: {
      userDetails: true,
    },
  });
};
