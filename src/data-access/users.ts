import prisma from "@/lib/prisma";
import { createInstantWallet } from "./wallets";

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

export const createUser = async (input: {
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
    },
  });

  await createInstantWallet(user.id);
};

export const getUserProfile = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
};
