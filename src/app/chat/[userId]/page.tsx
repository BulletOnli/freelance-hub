import React from "react";
import ChatRoom from "./_components/ChatRoom";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";

type Props = {
  params: {
    userId: string;
  };
};

const ChatRoomPage = async ({ params }: Props) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?redirect=/chat/[userId]");

  return (
    <div>
      <ChatRoom currentUser={currentUser} userId={params.userId} />
    </div>
  );
};

export default ChatRoomPage;
