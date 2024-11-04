"use client";
import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
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
    <div className="sticky top-0 z-50 w-full py-4 bg-primary-custom border-b border-customBorder">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <Briefcase className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">Freelance Hub</span>
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
