"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatUser } from "@/stores/chatStore";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type TConversation = {
  _id: string;
  participants: ChatUser[];
  receiver: ChatUser;
};

const Conversation = ({ conversation }: { conversation: TConversation }) => {
  const { receiver } = conversation;
  const pathname = usePathname();
  const userIdParams = pathname.split("/")[2];
  const isCurrentChat = receiver?.userId === userIdParams;

  const userQuery = useQuery<User>({
    queryKey: ["user", receiver?.userId],
    queryFn: async () => {
      const user = await fetch(`/api/clerk/getUser/${receiver?.userId}`);
      return user.json();
    },
    enabled: !!receiver?.userId,
  });

  if (userQuery.isLoading)
    return (
      <div className="flex items-center space-x-2 px-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );

  return (
    <Link href={`/chat/${receiver?.userId}`} className="w-full">
      <SidebarMenuItem>
        <div
          className={`relative text-black border-l-4 p-2 flex w-full items-center gap-3 text-wrap rounded ${
            isCurrentChat
              ? "bg-secondary-custom border-customDark"
              : "border-transparent hover:border-customDark hover:bg-secondary-custom"
          } `}
        >
          <Avatar>
            <AvatarImage src={userQuery.data?.imageUrl} />
            <AvatarFallback>
              {userQuery.data?.firstName?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          {userQuery.data?.firstName} {userQuery.data?.lastName}
        </div>
      </SidebarMenuItem>
    </Link>
  );
};

export default Conversation;
