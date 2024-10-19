import { getAllTransactionsByMonth } from "@/data-access/transactions";
import { getCurrentUser } from "@/lib/sessions";
import { z } from "zod";
import { createServerAction } from "zsa";

export const getMonthlyEarningsAction = createServerAction()
  .input(
    z.object({
      walletId: z.string(),
      targetDate: z.date(),
    })
  )
  .handler(async ({ input }) => {
    const { walletId, targetDate } = input;
    const user = await getCurrentUser();
    if (!user) throw new Error("Please login first");

    const transactionsThisMonth = await getAllTransactionsByMonth({
      walletId,
      status: "SUCCESS",
      createdAt: targetDate,
    });

    const earningsThisMonth = transactionsThisMonth.reduce(
      (acc, curr) => curr.amount + acc,
      0
    );

    const startOfLastMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() - 1,
      1
    );
    const transactionsLastMonth = await getAllTransactionsByMonth({
      walletId,
      status: "SUCCESS",
      createdAt: startOfLastMonth,
    });

    const earningsLastMonth = transactionsLastMonth.reduce(
      (acc, curr) => curr.amount + acc,
      0
    );

    return { earningsThisMonth, earningsLastMonth };
  });
