"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  MessageCircle,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { UserRole } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useSocketMessages } from "@/hooks/useSocketMessages";

const NAV_LINKS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    prohibitedRoles: [] as UserRole[],
  },
  {
    icon: BriefcaseBusiness,
    label: "Gigs",
    href: "/gigs",
    prohibitedRoles: [] as UserRole[],
  },
  {
    icon: MessageCircle,
    label: "Chat",
    href: "/chat",
    prohibitedRoles: [] as UserRole[],
  },
  {
    icon: UserRound,
    label: "Profile",
    href: "/profile",
    prohibitedRoles: ["CLIENT"] as UserRole[],
  },
];

// Routes that should not display the sidebar
const INVALID_ROUTES = ["/sign-in", "/sign-up", "/onboarding", "/chat"];

const Sidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const userRole = user?.publicMetadata?.role as UserRole;

  // Listen for new messages
  useSocketMessages();

  if (!user || INVALID_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <div className="fixed xl:left-0 bottom-0 w-full xl:w-auto xl:h-full py-6 xl:py-0 xl:px-6 flex justify-center items-center bg-gradient-to-t xl:bg-gradient-to-r from-customDark/5 to-black/0">
      <div className=" flex xl:flex-col items-center gap-4 py-2 xl:py-4 px-4 xl:px-2 bg-primary-custom border border-customBorder rounded-full">
        {NAV_LINKS.map((link) => {
          if (link.prohibitedRoles.includes(userRole)) {
            return null;
          }

          return (
            <TooltipProvider key={link.label}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      size="icon"
                      variant={
                        pathname.startsWith(link.href) ? "secondary" : "outline"
                      }
                      className="rounded-full size-11 border"
                    >
                      <link.icon />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-white text-customDark border"
                >
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
