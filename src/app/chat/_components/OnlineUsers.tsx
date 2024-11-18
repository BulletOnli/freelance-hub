"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/chatStore";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

const OnlineUsers = () => {
  const [isOpen, setIsOpen] = useState(true);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const userIds = onlineUsers ? Object.keys(onlineUsers) : [];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
        >
          <Users className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="flex justify-end h-fit bottom-0 p-0 bg-transparent border-none"
      >
        <div className="w-[320px] h-[50vh] pb-4 flex flex-col bg-white rounded-tl-lg ">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-2">Online Users</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations"
                className="pl-8 bg-gray-50"
                disabled
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto py-2">
            {userIds.length === 1 && (
              <p className="text-sm text-center mt-2">
                Currenly no active users
              </p>
            )}

            {userIds.map((userId) => (
              <OnlineUser key={userId} userId={userId} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const OnlineUser = ({ userId }: { userId: string }) => {
  const { user } = useUser();
  if (user?.id === userId) return null;

  const userQuery = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const user = await fetch(`/api/user/clerk/${userId}`);
      return user.json();
    },
    enabled: !!userId,
  });

  if (userQuery.isLoading)
    return (
      <div className="flex items-center space-x-2 px-4 mb-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-2 w-[150px]" />
          <Skeleton className="h-2 w-[100px]" />
        </div>
      </div>
    );

  return (
    <Link href={`/chat/${userId}`} className="w-full">
      <div className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50">
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userQuery.data?.imageUrl}
              alt={userQuery.data?.firstName ?? userId}
            />
            <AvatarFallback>
              {userQuery.data?.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
        </div>

        <span className="text-sm font-medium text-gray-700">
          {userQuery.data?.firstName} {userQuery.data?.lastName}
        </span>
      </div>
    </Link>
  );
};

export default OnlineUsers;
