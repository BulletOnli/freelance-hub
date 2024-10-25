"use client";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatUser } from "@/stores/chatStore";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export type TConversation = {
  _id: string;
  participants: ChatUser[];
  receiver: ChatUser;
};

const Conversation = ({ conversation }: { conversation: TConversation }) => {
  const { receiver } = conversation;

  const userQuery = useQuery<User>({
    queryKey: ["user", receiver?.userId],
    queryFn: async () => {
      const user = await fetch(`/api/clerk/getUser/${receiver?.userId}`);
      return user.json();
    },
  });

  if (userQuery.isLoading)
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );

  return (
    <Link href={`/chat/${receiver?.userId}`} className="w-full">
      <SidebarMenuItem>
        <div className="flex w-full items-center gap-3 text-wrap">
          {userQuery.data?.firstName} {userQuery.data?.lastName}
        </div>
      </SidebarMenuItem>
    </Link>
  );
};

export default Conversation;
