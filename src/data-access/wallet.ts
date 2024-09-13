import prisma from "@/lib/prisma";

export const createInstantWallet = async (userId: string) => {
  return await prisma.wallet.create({
    data: { userId },
  });
};
