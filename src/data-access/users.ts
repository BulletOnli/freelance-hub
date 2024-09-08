import prisma from "@/lib/prisma";
import argon2 from "argon2";

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

export const createUser = async (input: {
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
  await prisma.user.create({
    data: {
      id: input.id,
      // username: input.username,
      firstName: input.firstName,
      lastName: input.lastName,
      bio: input.bio,
      portfolio: input.portfolio,
      email: input.email,
      password: input.password,
      specialization: input.specialization,
      profilePicture: input.profilePicture,
    },
  });
};

export const getUserDetails = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
