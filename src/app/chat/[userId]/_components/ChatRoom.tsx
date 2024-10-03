"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { User } from "@/types";
import { socket } from "@/lib/socket";
import { env } from "@/env";
import { CHAT_API_URL } from "@/constants";

type OtherUser = {
  userId: string;
  email?: string;
  createdAt?: string;
};

type Message = {
  _id: string;
  sender: OtherUser;
  content: string;
  createdAt: string;
  conversation: string;
  receiver?: OtherUser;
};

type Props = {
  currentUser: User;
  userId: string;
};

const ChatRoom = ({ currentUser, userId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    let newMsg = await fetch(
      `${env.NEXT_PUBLIC_CHAT_SERVER_URL}/api/message/new-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser.id,
          senderEmail: currentUser.email,
          receiverId: otherUser?.userId,
          receiverEmail: otherUser?.email,
          conversationKey: userId,
          content: newMessage,
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => console.error(err));

    if (newMsg.error) {
      return console.log(newMsg.error);
    }

    newMsg = { ...newMsg, receiver: { userId } };

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
    fetch(`${CHAT_API_URL}/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOtherUser(data);
      });

    fetch(
      `${CHAT_API_URL}/message/all?receiverId=${userId}&senderId=${currentUser.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessages(data);
      });
  }, []);

  useEffect(() => {
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
            const isCurrentUser = message.sender?.userId === currentUser.id;
            return (
              <div
                key={message._id}
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
                              : otherUser?.email
                          }
                        />
                        <AvatarFallback>
                          {isCurrentUser
                            ? currentUser?.firstName[0]
                            : otherUser?.email?.[0]}
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
                      {message.createdAt}
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
