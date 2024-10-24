import React from "react";
import { getAllTransactions } from "@/data-access/transactions";
import { User } from "@/types";
import TransactionTable from "./TransactionTable";
import { columns } from "./columns";

type Props = {
  user: User;
};

const TransactionHistory = async ({ user }: Props) => {
  const transactions = await getAllTransactions(user.wallet!.id);

  return (
    <div className="space-y-4 p-4 h-full shadow rounded-lg">
      <p className="font-medium">Transaction History</p>

      <TransactionTable columns={columns} data={transactions} />
    </div>
  );
};

export default TransactionHistory;
