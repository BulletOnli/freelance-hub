"use client";
import { ChatUser } from "./ChatRoom";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CHAT_API_URL } from "@/constants";
import { useSession } from "@/providers/SessionProvider";
import MessageBox, { type Message } from "./MessageBox";

type Props = {
  receiver: ChatUser | null;
};

const Messages = ({ receiver }: Props) => {
  const { user: currentUser } = useSession();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const messages = useQuery<Message[]>({
    queryKey: ["messages", receiver?.userId],
    queryFn: async () => {
      const response = await axios.get(
        `${CHAT_API_URL}/message/all?receiverId=${receiver?.userId}&senderId=${currentUser?.id}`
      );
      return response.data;
    },
    enabled: !!receiver?.userId,
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
      className="h-[calc(100vh-12rem)] flex flex-col justify-end overflow-y-auto custom-scrollbar pr-4"
    >
      {messages?.data?.length === 0 && (
        <p className="text-center my-auto text-customGray">
          Start a conversation
        </p>
      )}

      {messages?.data?.map((message) => (
        <MessageBox key={message._id} message={message} receiver={receiver} />
      ))}
    </div>
  );
};

export default Messages;
