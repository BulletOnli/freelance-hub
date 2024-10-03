"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { socket } from "@/lib/socket";
import { env } from "@/env";
import { CHAT_API_URL } from "@/constants";
import Messages from "./Messages";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/providers/SessionProvider";

// Other user is user from chat service database
export type OtherUser = {
  userId: string;
  email?: string;
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
  // Other user is user from chat service database
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagePayload = {
        senderId: currentUser?.id,
        senderEmail: currentUser?.email,
        receiverId: otherUser?.userId,
        receiverEmail: otherUser?.email,
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
    const initializeChat = async () => {
      const userData = await fetchUserData(userId);
      setOtherUser(userData);
    };

    initializeChat();

    socket.on("message", (message) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", userId],
      });
    });

    return () => {
      socket.off("message");
    };
  }, [userId, currentUser?.id]);

  return (
    <div className="w-2/3 space-y-2 mx-auto p-4">
      <Messages otherUser={otherUser} />
      <div className="flex-1 overflow-hidden"></div>

      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
