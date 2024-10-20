"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  BriefcaseBusiness,
  Home,
  LayoutDashboard,
  MessageCircle,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { RedirectType, usePathname, useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";

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
const INVALID_ROUTES = ["/login", "/signup"];

const Sidebar = () => {
  const { user } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      socket.emit("join", user?.id);
      console.log("User joined", user?.id);
    }

    socket.on("message", (message) => {
      toast.message("💬 [Sender's Name] sent you a message!", {
        description: "Don't let this message go cold!",
        action: {
          label: "View",
          onClick: () => router.push(`/chat/${message?.sender?.userId}`),
        },
        duration: 30_000,
      });
    });

    return () => {
      socket.off("message");
    };
  }, [user]);

  if (!user || INVALID_ROUTES.includes(pathname)) return null;

  return (
    <div className="fixed xl:left-0 bottom-0 w-full xl:w-auto xl:h-full py-6 xl:py-0 xl:px-6 flex justify-center items-center bg-gradient-to-t xl:bg-gradient-to-r from-customDark/5 to-black/0">
      <div className="flex xl:flex-col items-center gap-4 py-2 xl:py-4 px-4 xl:px-2 bg-white rounded-full shadow">
        {NAV_LINKS.map((link) => {
          // Check if the user role is prohibited from accessing the link
          if (user && link.prohibitedRoles.includes(user?.role)) return null;

          return (
            <TooltipProvider key={link.label}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full size-12"
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
