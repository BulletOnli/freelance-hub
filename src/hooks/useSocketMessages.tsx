"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSocketMessages() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    socket?.emit("join", user.id);
    console.log("User joined", user.id);

    socket?.on("message", (message) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", message?.sender?.userId],
      });

      if (pathname === `/chat/${message?.sender?.userId}`) return;

      toast.message(`💬 ${message?.sender?.userId} sent you a message!`, {
        description: "Don't let this message go cold!",
        action: {
          label: "View",
          onClick: () => router.push(`/chat/${message?.sender?.userId}`),
        },
        duration: 30_000,
      });
    });

    return () => {
      socket?.off("message");
    };
  }, [user?.id, pathname]);
}
