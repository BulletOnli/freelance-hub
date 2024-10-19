import prisma from "@/lib/prisma";
import {
  WALLET_TRANSACTION_STATUS,
  WALLET_TRANSACTION_TYPE,
} from "@prisma/client";

export const getAllTransactionsByMonth = async ({
  walletId,
  status,
  createdAt,
}: {
  walletId: string;
  status?: WALLET_TRANSACTION_STATUS;
  createdAt?: Date;
}) => {
  if (!createdAt) {
    throw new Error("createdAt is required to filter by month.");
  }

  const startOfMonth = new Date(
    createdAt.getFullYear(),
    createdAt.getMonth(),
    1
  );
  const endOfMonth = new Date(
    createdAt.getFullYear(),
    createdAt.getMonth() + 1,
    1
  );

  return await prisma.walletTransaction.findMany({
    where: {
      walletId,
      status,
      createdAt: { gte: startOfMonth, lt: endOfMonth },
    },
  });
};

type CreateTransaction = {
  amount: number;
  type: WALLET_TRANSACTION_TYPE;
  status: WALLET_TRANSACTION_STATUS;
  walletId: string;
  description: string;
};

export const createTransaction = async ({
  amount,
  status,
  type,
  walletId,
  description,
}: CreateTransaction) => {
  return await prisma.walletTransaction.create({
    data: {
      amount,
      description,
      type,
      status,
      walletId,
    },
  });
};
