"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/providers/SessionProvider";
import { ChatUser } from "@/stores/chatStore";
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
  const { user: currentUser } = useSession();
  const isCurrentUser = message.sender?.userId === currentUser?.id;

  return (
    <div
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start space-x-2 max-w-[70%] ${
          isCurrentUser && "flex-row-reverse space-x-reverse"
        }`}
      >
        {!isCurrentUser && (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
            />
            <AvatarFallback>
              {isCurrentUser
                ? currentUser?.firstName[0]
                : receiver?.userId?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`rounded-lg p-3 ${
            isCurrentUser ? "bg-customDark text-white" : "bg-gray-200"
          }`}
        >
          <div
            className={`text-sm ${isCurrentUser ? "text-white" : "text-black"}`}
          >
            {message.content}
          </div>
          <div
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {format(new Date(message.createdAt), "hh:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
