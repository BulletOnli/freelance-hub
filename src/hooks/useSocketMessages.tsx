"use client";
import { useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useChatStore } from "@/stores/chatStore";

type Message = {
  sender?: {
    userId: string;
  };
};

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
  const { setOnlineUsers } = useChatStore();

  const handleOnlineStatus = useCallback(
    ({ isConnected, userId, users }: OnlineStatusPayload) => {
      setOnlineUsers(users);
      if (userId === user?.id) return;
      toast.info(`${userId} is now ${isConnected ? "online" : "offline"}`);
    },
    [user?.id, setOnlineUsers]
  );

  const handleMessage = useCallback(
    (message: Message) => {
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
        duration: 10_000,
      });
    },
    [pathname, queryClient, router]
  );

  useEffect(() => {
    if (!user?.id || !socket?.connected) {
      socket.emit("logout");
      return;
    }

    const handleConnect = () => {
      socket.emit("join", user.id);
    };

    const handleError = (error: Error) => {
      console.error("Socket error:", error);
      toast.error("Connection error. Trying to reconnect...");
    };

    socket.on("connect", handleConnect);
    socket.on("error", handleError);
    socket.on("onlineStatus", handleOnlineStatus);
    socket.on("message", handleMessage);

    socket.emit("join", user.id);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("error", handleError);
      socket.off("onlineStatus", handleOnlineStatus);
      socket.off("message", handleMessage);
    };
  }, [user?.id, handleOnlineStatus, handleMessage]);

  const reconnect = useCallback(() => {
    if (socket && user?.id) {
      socket.connect();
      socket.emit("join", user.id);
    }
  }, [user?.id]);

  return { reconnect };
}
