import prisma from "@/lib/prisma";

export const createInstantWallet = async (userId: string) => {
  return await prisma.wallet.create({
    data: { userId },
  });
};

export const decrementWalletBalance = async ({
  amount,
  userId,
}: {
  userId: string;
  amount: number;
}) => {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });
};

export const incrementWalletBalance = async ({
  amount,
  userId,
}: {
  userId: string;
  amount: number;
}) => {
  return await prisma.wallet.update({
    where: { userId },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
};
