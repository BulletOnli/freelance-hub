import React from "react";
import ChatRoom from "./_components/ChatRoom";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";
import NotFound from "@/app/not-found";

type Props = {
  params: {
    userId: string;
  };
};

const ChatRoomPage = async ({ params }: Props) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?redirect=/chat/[userId]");

  if (currentUser.id === params.userId) return <NotFound />;

  return (
    <div>
      <ChatRoom userId={params.userId} currentUser={currentUser} />
    </div>
  );
};

export default ChatRoomPage;
