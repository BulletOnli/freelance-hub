import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import formatCurrency from "@/utils/formatCurrency";
import { Gem, History, TreePalm, Wallet } from "lucide-react";
import { User } from "@/types";
import TopUpModal from "./TopUpModal";
import Link from "next/link";
import { UseQueryResult } from "@tanstack/react-query";

type Props = {
  userQuery: UseQueryResult<User, Error>;
};

const WalletDropdown = ({ userQuery }: Props) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger className="outline-none">
          <div className="flex items-center gap-2 px-4 py-2 border border-customBorder rounded-md">
            <Wallet color="#5D5D5D" className="size-5" />
            <p className="text-sm font-semibold text-customGray">
              {userQuery.isLoading
                ? "Loading..."
                : formatCurrency(userQuery.data?.wallet?.balance)}
            </p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem className="space-x-2" asChild>
              <Link href="/dashboard">
                <History className="size-5" color="#5D5D5D" />
                <span>Transactions</span>
              </Link>
            </DropdownMenuItem>

            {userQuery.data?.role !== "FREELANCER" && (
              <DropdownMenuItem
                className="space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true); // Open modal without closing dropdown
                }}
              >
                <Gem className="size-5" color="#5D5D5D" />
                <span>Top up</span>
              </DropdownMenuItem>
            )}

            {userQuery.data?.role !== "CLIENT" && (
              <DropdownMenuItem className="space-x-2" disabled>
                <TreePalm className="size-5" color="#5D5D5D" />
                <span>Withdraw</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <TopUpModal onOpenChange={setIsModalOpen} open={isModalOpen} />
    </>
  );
};

export default WalletDropdown;
