"use client";
import React from "react";
import { Button } from "../ui/button";
import { Home, LayoutDashboard, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";

const NAV_LINKS = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    prohibitedRoles: [],
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    prohibitedRoles: [],
  },
  {
    icon: UserRound,
    label: "Profile",
    href: "/profile",
    prohibitedRoles: ["CLIENT"],
  },
];

// Routes that should not display the sidebar
const INVALID_ROUTES = ["/login", "/signup", "/chat"];

const Sidebar = () => {
  const { user } = useSession();
  const pathname = usePathname();
  if (INVALID_ROUTES.includes(pathname)) return null;

  return (
    <div className="fixed left-0 bottom-0 h-full px-6 flex justify-center items-center bg-gradient-to-r from-customDark/5 to-black/0">
      <div className="flex flex-col items-center gap-4 py-4 px-2 bg-white rounded-full shadow">
        {NAV_LINKS.map((link) => {
          // Check if the user role is prohibited from accessing the link
          if (user && link.prohibitedRoles.includes(user?.role)) return null;

          return (
            <Link key={link.label} href={link.href}>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full size-12"
              >
                <link.icon />
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
