import React from "react";
import ChatRoom from "./_components/ChatRoom";
import { redirect } from "next/navigation";
import NotFound from "@/app/not-found";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: {
    userId: string;
  };
};

const ChatRoomPage = async ({ params }: Props) => {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) redirect("/sign-in");

  if (currentUserId === params.userId) return <NotFound />;

  return (
    <div>
      <ChatRoom userId={params.userId} />
    </div>
  );
};

export default ChatRoomPage;
