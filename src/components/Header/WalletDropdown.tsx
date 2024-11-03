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
import { Gem, History, Settings, TreePalm, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { User } from "@/types";
import TopUpModal from "./TopUpModal";
import Link from "next/link";

const WalletDropdown = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: clerkUser } = useUser();

  const userQuery = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await axios.get("/api/user/loggedInUser");
      return response.data;
    },
    enabled: !!clerkUser?.id,
  });

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
            <DropdownMenuItem className="space-x-2" disabled>
              <TreePalm className="size-5" color="#5D5D5D" />
              <span>Cash out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <TopUpModal onOpenChange={setIsModalOpen} open={isModalOpen} />
    </>
  );
};

export default WalletDropdown;
