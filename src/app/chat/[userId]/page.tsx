import React from "react";
import ChatRoom from "./_components/ChatRoom";
import NotFound from "@/app/not-found";
import { auth, clerkClient, User } from "@clerk/nextjs/server";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatRoomHeader from "./_components/ChatRoomHeader";

type Props = {
  params: {
    userId: string;
  };
};

const ChatRoomPage = async ({ params }: Props) => {
  const { userId: currentUserId } = await auth();
  if (currentUserId === params.userId) return <NotFound />;

  try {
    await clerkClient().users.getUser(params.userId);
  } catch (error) {
    return (
      <div className="my-8 text-center font-semibold text-xl uppercase">
        user not found
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-7xl mx-auto space-y-4">
      <ChatRoomHeader receiverId={params.userId} />

      <ChatRoom userId={params.userId} />
    </div>
  );
};

export default ChatRoomPage;
