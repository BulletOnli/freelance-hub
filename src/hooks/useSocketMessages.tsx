"use client";
import { useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useChatStore } from "@/stores/chatStore";
import { Message } from "@/app/chat/[userId]/_components/MessageBox";

type OnlineStatusPayload = {
  isConnected: boolean;
  userId: string;
  users: Record<string, boolean>;
};

export function useSocketMessages() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);

  const handleOnlineStatus = useCallback(
    async ({ isConnected, userId, users }: OnlineStatusPayload) => {
      setOnlineUsers(users);
      if (userId === user?.id) return; // Ignore own status

      const response = await fetch(`/api/user/clerk/${userId}`);
      const data = await response.json();
      const fullName = `${data?.firstName} ${data?.lastName}`;

      toast.info(`${fullName} is now ${isConnected ? "online" : "offline"}`);
    },
    [user?.id, setOnlineUsers]
  );

  const handleMessage = useCallback(
    async (message: Message) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", message?.sender?.userId],
      });

      if (pathname === `/chat/${message?.sender?.userId}`) return;

      const response = await fetch(
        `/api/user/clerk/${message?.sender?.userId}`
      );
      const data = await response.json();
      const fullName = `${data?.firstName} ${data?.lastName}`;

      toast.message(`💬 ${fullName} sent you a message!`, {
        description: "Don't let this message go cold!",
        action: {
          label: "View",
          onClick: () => router.push(`/chat/${message?.sender?.userId}`),
        },
        duration: 10_000,
      });
    },
    [pathname, queryClient, router]
  );

  useEffect(() => {
    // if (!user?.id || !socket?.connected) {
    //   socket.emit("logout");
    //   return;
    // }
    if (!user?.id) {
      socket.emit("logout");
      return;
    }

    const handleConnect = () => {
      socket.emit("join", user?.id);
    };

    const handleError = (error: Error) => {
      console.error("Socket error:", error);
      toast.error("Connection error. Trying to reconnect...");
    };

    socket.on("connect", handleConnect);
    socket.on("error", handleError);
    socket.on("onlineStatus", handleOnlineStatus);
    socket.on("message", handleMessage);

    socket.emit("join", user?.id);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("error", handleError);
      socket.off("onlineStatus", handleOnlineStatus);
      socket.off("message", handleMessage);
    };
  }, [user?.id]);

  const reconnect = useCallback(() => {
    if (socket && user?.id) {
      socket.connect();
      socket.emit("join", user.id);
    }
  }, [user?.id]);

  return { reconnect };
}
