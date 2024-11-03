"use client";
import React from "react";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SettingsMenu from "./SettingsMenu";
import { useChatStore } from "@/stores/chatStore";

type Props = {
  receiverId: string;
};

const ChatRoomHeader = ({ receiverId }: Props) => {
  const isOnline = useChatStore((state) => state.isUserOnline(receiverId));

  const userQuery = useQuery<User>({
    queryKey: ["user", receiverId],
    queryFn: async () => {
      const user = await fetch(`/api/user/clerk/${receiverId}`);
      return user.json();
    },

    enabled: !!receiverId,
  });

  return (
    <div className="w-full flex items-center justify-between bg-primary-custom px-4 py-2 border border-sidebar-border rounded-lg">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={userQuery.data?.imageUrl} />
          <AvatarFallback>
            {userQuery.data?.firstName?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        {userQuery.isLoading && (
          <div className="space-y-1">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        )}
        <p className="font-medium">
          {userQuery.data?.firstName} {userQuery.data?.lastName}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline">
          <div
            className={`${
              isOnline ? "bg-green-500" : "bg-gray-400"
            } size-2 mr-2 rounded-full`}
          ></div>
          {isOnline ? "Active now" : "Offline"}
        </Badge>

        <SettingsMenu />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
