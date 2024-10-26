"use client";
import React from "react";
import { Search, Plus, MessageCircle, StepForward } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { CHAT_API_URL } from "@/constants";
import Conversation, { TConversation } from "./Conversation";
import Link from "next/link";

const ChatSidebar = () => {
  const { user } = useUser();

  const conversationsQuery = useQuery<TConversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await axios(
        `${CHAT_API_URL}/conversation/all/${user?.id}`
      );

      return response.data;
    },
    enabled: !!user,
  });

  return (
    <SidebarProvider className="min-h-[calc(100vh - 280px)] w-fit">
      <Sidebar variant="floating" className="top-[72px]">
        <SidebarHeader className=" flex justify-center items-center border-b py-4 px-4">
          <Link href="/chat">
            <div className="font-semibold flex items-center gap-2">
              <MessageCircle className="size-5" />
              Freelance Chats
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-3 size-4 text-muted-foreground" />
              <Input
                disabled
                placeholder="Search conversations"
                className="pl-10"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)] px-2">
            {conversationsQuery?.isLoading && <div>Loading...</div>}

            <SidebarMenu className="gap-2">
              {/* @ts-ignore */}
              {conversationsQuery?.data?.error && <div>Error</div>}

              {conversationsQuery?.data?.map((conversation: any) => (
                <Conversation
                  key={conversation?._id}
                  conversation={conversation}
                />
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>

        <SidebarRail className="flex justify-center items-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <StepForward className="size-7" color="#020617" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarRail>
      </Sidebar>
    </SidebarProvider>
  );
};

export default ChatSidebar;
