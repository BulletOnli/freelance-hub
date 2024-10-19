import React from "react";
import { useServerAction } from "zsa-react";
import { getMonthlyEarningsAction } from "../action";
import { User } from "@/types";
import formatCurrency from "@/utils/formatCurrency";
import calculateEarningPercentage from "@/utils/calculateEarningPercentage";

const TotalEarnings = async ({ user }: { user: User }) => {
  if (user.role === "CLIENT") return null;

  const [data, err] = await getMonthlyEarningsAction({
    walletId: user.wallet!.id,
    targetDate: new Date("2024-10-14T14:01:26.911Z"),
  });

  const percentageChange = calculateEarningPercentage(
    data?.earningsThisMonth,
    data?.earningsLastMonth
  );

  return (
    <div className="flex flex-1 flex-col gap-2 text-sm p-6 rounded-lg shadow">
      <p className="font-medium">Earnings this Month</p>
      <p className="text-2xl font-bold">
        {formatCurrency(data?.earningsThisMonth!)}
      </p>
      <p className="text-customGray">
        {percentageChange > 0 && "+"}
        {percentageChange}% from last month
      </p>
    </div>
  );
};

export default TotalEarnings;
