import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HandCoins, History, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { validateRequest } from "@/auth";

const ProfileDropDown = async () => {
  const session = await validateRequest();

  if (!session) {
    return (
      <Button size="sm" asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback className="border border-customOrange text-darkGray font-semibold">
              {session?.user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-4 p-4 min-w-[300px]">
          <div className="flex items-center gap-2">
            <Avatar className="size-10">
              <AvatarFallback className="border border-customOrange text-darkGray font-semibold">
                {session?.user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-darkGray font-semibold">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col border border-lightBorder rounded-lg">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <p className="font-medium">Available Coins</p>
              </div>
              <p className="my-2 text-2xl text-[#F2BC1A] font-bold">₱ 0</p>
            </div>

            <div className="w-full flex items-center justify-center border-t border-lightBorder ">
              <Button
                asChild
                variant="ghost"
                className="w-full h-full flex items-center justify-center gap-2 py-2 text-sm "
              >
                <Link href="/">
                  <History className="text-defaultGray size-5" />
                  History
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full h-full flex items-center justify-center gap-2 py-2 text-sm "
              >
                <Link href="/topup">
                  <HandCoins className="text-defaultGray size-5" />
                  Top up
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Settings className="text-defaultGray size-5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <LogOut className="text-defaultGray size-5" />
              Logout
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDropDown;
