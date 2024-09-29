"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { User } from "@/types";
import { socket } from "@/lib/socket";

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  roomKey?: string;
};

const otherUser = {
  id: "2",
  name: "Alice",
  status: "active",
  avatar: "/placeholder.svg?height=40&width=40",
};

type Props = {
  currentUser: User;
  roomKey: string;
};

const ChatRoom = ({ currentUser, roomKey }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg: Message = {
      id: messages.length + 1 + "",
      senderId: currentUser?.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      roomKey,
    };
    socket.emit("message", newMsg);
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage("");
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (roomKey) {
      socket.emit("join", roomKey);
    }

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Message received", message);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-2/3 space-y-2 mx-auto p-4">
      <div className="flex-1 overflow-hidden">
        <div
          ref={chatContainerRef}
          className="h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar pr-4"
        >
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[70%] ${
                    isCurrentUser && "flex-row-reverse space-x-reverse"
                  }`}
                >
                  {!isCurrentUser && (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={undefined}
                          alt={
                            isCurrentUser
                              ? currentUser?.firstName
                              : otherUser.name
                          }
                        />
                        <AvatarFallback>
                          {isCurrentUser
                            ? currentUser?.firstName[0]
                            : otherUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      isCurrentUser ? "bg-customDark text-white" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`text-sm ${
                        isCurrentUser ? "text-white" : "text-black"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
