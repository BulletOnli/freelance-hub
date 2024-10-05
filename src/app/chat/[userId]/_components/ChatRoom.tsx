"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { socket } from "@/lib/socket";
import { env } from "@/env";
import { CHAT_API_URL } from "@/constants";
import Messages from "./Messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/providers/SessionProvider";
import Loading from "@/app/loading";

export type ChatUser = {
  _id?: string;
  userId: string;
  createdAt?: string;
};

type Props = {
  userId: string;
};

const fetchUserData = async (userId: string) => {
  const response = await fetch(`${CHAT_API_URL}/user/${userId}`);
  return response.json();
};

const ChatRoom = ({ userId }: Props) => {
  const { user: currentUser } = useSession();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState<ChatUser | null>(null);

  const conversation = useQuery({
    queryKey: ["conversation", currentUser?.id, userId],
    queryFn: async () => {
      const response = await fetch(`${CHAT_API_URL}/conversation/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser?.id,
          receiverId: userId,
        }),
      });

      const responseJson = await response.json();
      const receiver = responseJson?.participants?.find(
        (p: ChatUser) => p.userId !== currentUser?.id
      );

      setReceiver(receiver || null);
      console.log("Chat initialized", receiver);
      return receiver;
    },
    enabled: !!currentUser?.id && !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagePayload = {
        senderId: currentUser?.id,
        receiverId: receiver?.userId || userId,
        conversationKey: userId,
        content: newMessage,
      };

      const newMsg = await fetch(
        `${env.NEXT_PUBLIC_CHAT_SERVER_URL}/api/message/new-message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messagePayload),
        }
      ).then((res) => res.json());

      if (newMsg.error) {
        console.error(newMsg.error);
        return;
      }

      socket.emit("message", { ...newMsg, receiver: { userId } });
      queryClient.invalidateQueries({
        queryKey: ["messages", userId],
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    socket.on("message", (message) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", userId],
      });
    });

    return () => {
      socket.off("message");
    };
  }, [userId, queryClient]);

  if (conversation.isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-2/3 space-y-2 mx-auto p-4">
      <Messages receiver={receiver} />
      <div className="flex-1 overflow-hidden"></div>

      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          autoFocus
        />
        <Button size="icon" onClick={handleSendMessage}>
          <Send className="h-4 w-4" color="white" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
