"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash } from "lucide-react";
import axios from "axios";
import { CHAT_API_URL } from "@/constants";
import { toast } from "sonner";
import { useChatStore } from "@/stores/chatStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const SettingsMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-full hover:bg-secondary-custom">
        <EllipsisVertical className="size-5" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <ToggleMute />
        <DropdownMenuSeparator />
        <DeleteConversation />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteConversation = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { conversationId, receiver } = useChatStore();
  const { user } = useUser();

  const handleDeleteConversation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${CHAT_API_URL}/conversation/delete/${conversationId}`,
        { userId: user?.id }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setIsConfirmOpen(false);
      toast.success("Conversation deleted!");
    } catch (error) {
      console.log("Error deleting conversation", error);
      toast.error("An error occured. Please try again later.");
    } finally {
      setIsLoading(false);
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", receiver?.userId],
      });
    }
  };

  return (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete Conversation</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            conversation and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handleDeleteConversation}
          >
            {isLoading && (
              <Loader2 className="animate-spin mr-1 size-5" color="white" />
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ToggleMute = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    console.log(
      `Notifications ${notificationsEnabled ? "disabled" : "enabled"}`
    );
  };

  return (
    <DropdownMenuItem
      disabled
      onSelect={(e) => e.preventDefault()}
      className="flex items-center justify-between gap-2"
    >
      <div className="flex items-center">
        <BellOff className="mr-2 h-4 w-4" />
        <span>Mute Notification</span>
      </div>
      <Switch
        checked={!notificationsEnabled}
        onCheckedChange={handleToggleNotifications}
        aria-label="Toggle notifications"
      />
    </DropdownMenuItem>
  );
};

export default SettingsMenu;
