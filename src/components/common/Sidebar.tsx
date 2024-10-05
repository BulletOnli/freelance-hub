"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Home, LayoutDashboard, MessageCircle, UserRound } from "lucide-react";
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

const NAV_LINKS = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    prohibitedRoles: [],
  },
  {
    icon: LayoutDashboard,
    label: "Gigs",
    href: "/gigs",
    prohibitedRoles: [],
  },
  {
    icon: MessageCircle,
    label: "Chat",
    href: "/chat",
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
const INVALID_ROUTES = ["/login", "/signup"];

const Sidebar = () => {
  const { user } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  if (!user || INVALID_ROUTES.includes(pathname)) return null;

  useEffect(() => {
    if (user.id) {
      socket.emit("join", user.id);
      console.log("User joined", user.id);
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
  }, [user?.id]);

  return (
    <div className="fixed left-0 bottom-0 h-full px-6 flex justify-center items-center bg-gradient-to-r from-customDark/5 to-black/0">
      <div className="flex flex-col items-center gap-4 py-4 px-2 bg-white rounded-full shadow">
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
