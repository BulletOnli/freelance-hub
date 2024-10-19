import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllTransactions } from "@/data-access/transactions";
import { ADMIN_WALLET_ID } from "@/constants";
import { User } from "@/types";
import formatCurrency from "@/utils/formatCurrency";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  user: User;
};

const TransactionHistory = async ({ user }: Props) => {
  const transactions = await getAllTransactions(user.wallet!.id);

  return (
    <div className="space-y-2 p-4 h-full shadow rounded-lg">
      <p className="font-medium text-center">Transaction History</p>

      <ScrollArea className="h-[88%]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.slice(0, 50)?.map((transaction) => {
              const type = transaction.type === "CREDIT" ? "-" : "+";
              const color =
                transaction.type === "CREDIT"
                  ? "text-red-600"
                  : "text-green-600";

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell
                    className={`${color} text-right w-fit min-w-[7rem]`}
                  >
                    {type}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {transactions?.length > 10 && (
        <Link
          href={"#"}
          className="flex items-center justify-center gap-1 group py-2"
        >
          <p className="text-customGray text-sm">View All</p>
          <ArrowRight
            className="size-4 group-hover:ml-[2px] group-hover:duration-100"
            color="#5d5d5d "
          />
        </Link>
      )}
    </div>
  );
};

export default TransactionHistory;
