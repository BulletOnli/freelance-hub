"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Messages from "./Messages";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/stores/chatStore";
import { useUser } from "@clerk/nextjs";

type Props = {
  userId: string;
};

const ChatRoom = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { receiver, initializeChat, sendMessage } = useChatStore();
  const { user: currentUser } = useUser();

  const handleSendMessage = async () => {
    if (!inputRef.current) return;
    const newMessage = inputRef.current?.value;

    await sendMessage({
      // @ts-ignore
      senderId: currentUser?.id,
      message: newMessage,
    });

    queryClient.invalidateQueries({
      queryKey: ["messages", receiver?.userId],
    });
    inputRef.current.value = "";
  };

  useEffect(() => {
    if (receiver?.userId !== userId && currentUser?.id) {
      initializeChat(currentUser?.id, userId);
    }
  }, [currentUser?.id]);

  return (
    <div className="w-2/3 space-y-2 mx-auto p-4">
      <Messages receiver={receiver} />
      <div className="flex-1 overflow-hidden"></div>

      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          ref={inputRef}
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
