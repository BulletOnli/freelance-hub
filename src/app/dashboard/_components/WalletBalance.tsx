import { User } from "@/types";
import formatCurrency from "@/utils/formatCurrency";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const WalletBalance = ({ user }: { user: User }) => {
  return (
    <div className="flex-1 flex flex-col gap-2 text-sm p-6 rounded-lg shadow">
      <p className="font-medium">Wallet Balance</p>
      <p className="text-2xl font-bold">
        {formatCurrency(user.wallet?.balance)}
      </p>
      <Link href={"#"} className="flex items-center gap-1 group">
        <p className="text-customGray">View History</p>
        <ArrowRight
          className="size-5 group-hover:ml-[2px] group-hover:duration-100"
          color="#5d5d5d "
        />
      </Link>
    </div>
  );
};

export default WalletBalance;
