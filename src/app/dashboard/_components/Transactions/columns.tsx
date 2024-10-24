"use client";
import formatCurrency from "@/utils/formatCurrency";
import { WalletTransaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";

export type Transaction = WalletTransaction & {
  gigContract: {
    gigId: string;
  } | null;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      const isAsc = column.getIsSorted() === "asc";

      return (
        <div
          className="flex items-center gap-1 cursor-pointer text-customGray"
          onClick={() => column.toggleSorting(isAsc)}
        >
          Date
          {isAsc ? (
            <ArrowUp className="size-4" />
          ) : (
            <ArrowDown className="size-4" />
          )}
        </div>
      );
    },
    cell: ({ row }) => {
      const updatedDate = row.original.updatedAt;
      return format(new Date(updatedDate), "MM/dd/yyyy hh:mm a");
    },
  },
  {
    accessorKey: "description",
    header: () => {
      return <p className="text-customGray">Description</p>;
    },
  },
  {
    accessorKey: "amount",
    header: () => {
      return <p className="text-right text-customGray">Amount</p>;
    },
    cell: ({ row }) => {
      const amount: number = row.getValue("amount");
      const type = row.original.type === "CREDIT" ? "-" : "+";
      const color =
        row.original.type === "CREDIT" ? "text-red-600" : "text-green-600";

      return (
        <p className={`${color} text-right font-medium `}>
          {type}
          {formatCurrency(amount)}
        </p>
      );
    },
  },
];
