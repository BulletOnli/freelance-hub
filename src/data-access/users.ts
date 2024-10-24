import prisma from "@/lib/prisma";
import { createInstantWallet } from "./wallets";

export const getLoggedInUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
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
  profilePicture: string;
}) => {
  const user = await prisma.user.create({
    data: {
      id: input.id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      profilePicture: input.profilePicture,
    },
  });

  await createInstantWallet(user.id);
};

export const getUserProfile = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });
};
