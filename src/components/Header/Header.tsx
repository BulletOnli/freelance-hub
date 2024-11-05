"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import WalletDropdown from "./WalletDropdown";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import axios from "axios";
import { Badge } from "../ui/badge";

const AUTH_ROUTES = ["/sign-in", "/sign-up", "/onboarding"];

const Header = () => {
  const pathname = usePathname();
  const { user: clerkUser } = useUser();

  const userQuery = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await axios.get("/api/user/loggedInUser");
      return response.data;
    },
    enabled: !!clerkUser?.id,
  });

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-primary-custom border-b border-customBorder">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <img src="/images/logo.png" alt="" className="size-20" />
        </Link>

        <SignedOut>
          <SignInButton>
            <Button size="sm">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-6">
            {!userQuery.isPending && (
              <Badge variant="secondary" className="border border-customBorder">
                {userQuery.data?.role}
              </Badge>
            )}
            <WalletDropdown userQuery={userQuery} />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-10",
                },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
