"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatUser } from "@/stores/chatStore";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export type Message = {
  _id: string;
  sender: ChatUser;
  content: string;
  createdAt: string;
  conversation: string;
  receiver?: ChatUser;
};

type Props = {
  receiver: ChatUser | null;
  message: Message;
};

const MessageBox = ({ message, receiver }: Props) => {
  const { user: currentUser } = useUser();
  const isCurrentUser = message.sender?.userId === currentUser?.id;
  const queryClient = useQueryClient();
  const receiverDetails: User | undefined = queryClient.getQueryData([
    "user",
    receiver?.userId,
  ]);

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start space-x-2 max-w-[70%] ${
          isCurrentUser && "flex-row-reverse space-x-reverse"
        }`}
      >
        {!isCurrentUser && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={receiverDetails?.imageUrl} alt="User avatar" />
            <AvatarFallback>
              {isCurrentUser
                ? currentUser?.firstName?.[0]
                : receiverDetails?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={`rounded-lg p-3 bg-primary-custom border border-customBorder`}
        >
          <div className={`text-sm`}>{message.content}</div>
          <div className={`text-xs mt-1 text-customGray/70`}>
            {format(new Date(message.createdAt), "hh:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
