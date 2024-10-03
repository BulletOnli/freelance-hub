"use client";
import { OtherUser } from "./ChatRoom";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CHAT_API_URL } from "@/constants";
import { useSession } from "@/providers/SessionProvider";
import MessageBox, { type Message } from "./MessageBox";

type Props = {
  otherUser: OtherUser | null;
};

const Messages = ({ otherUser }: Props) => {
  const { user: currentUser } = useSession();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const messages = useQuery<Message[]>({
    queryKey: ["messages", otherUser?.userId],
    queryFn: async () => {
      const response = await axios.get(
        `${CHAT_API_URL}/message/all?receiverId=${otherUser?.userId}&senderId=${currentUser?.id}`
      );
      return response.data;
    },
    enabled: !!otherUser?.userId,
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar pr-4"
    >
      {messages?.data?.map((message) => (
        <MessageBox key={message._id} message={message} otherUser={otherUser} />
      ))}
    </div>
  );
};

export default Messages;
