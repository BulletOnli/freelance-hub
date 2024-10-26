"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Settings,
  User,
  Bell,
  Moon,
  Trash,
  EllipsisVertical,
  BellOff,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SettingsMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-full hover:bg-customDark/5">
        <EllipsisVertical className="size-5" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <ToggleMute />
        <DropdownMenuSeparator />
        <DeleteConversation />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteConversation = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteConversation = () => {
    // Implement the actual delete logic here
    console.log("Conversation deleted");
    setIsConfirmOpen(false);
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
          <AlertDialogAction onClick={handleDeleteConversation}>
            Delete
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
