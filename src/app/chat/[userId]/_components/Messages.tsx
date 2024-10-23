"use client";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CHAT_API_URL } from "@/constants";
import MessageBox, { type Message } from "./MessageBox";
import Loading from "@/app/loading";
import { ChatUser } from "@/stores/chatStore";
import { useUser } from "@clerk/nextjs";

type Props = {
  receiver: ChatUser | null;
};

const Messages = ({ receiver }: Props) => {
  const { user: currentUser } = useUser();
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

  if (messages.isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col justify-end pr-4">
      {messages?.data?.length === 0 && (
        <p className="text-center my-auto text-customGray">
          Start a conversation
        </p>
      )}

      <div ref={chatContainerRef} className="overflow-y-auto custom-scrollbar">
        {messages?.data?.map((message) => (
          <MessageBox key={message._id} message={message} receiver={receiver} />
        ))}
      </div>
    </div>
  );
};

export default Messages;
