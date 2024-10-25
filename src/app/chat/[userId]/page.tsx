import React from "react";
import ChatRoom from "./_components/ChatRoom";
import NotFound from "@/app/not-found";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

  return <ChatRoom userId={params.userId} />;
};

export default ChatRoomPage;
