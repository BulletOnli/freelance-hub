"use client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { useGlobalStore } from "@/stores/globalStore";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import axios from "axios";

const DEFAULT_THRESHOLD = 50;

const BalanceReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const setIsTopupModalOpen = useGlobalStore(
    (state) => state.setIsTopupModalOpen
  );
  const { isSignedIn, user: clerkUser } = useUser();

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await axios.get("/api/user/loggedInUser");
      return response.data;
    },
    enabled: !!clerkUser?.id,
  });

  useEffect(() => {
    const balance = currentUser?.wallet?.balance || 0;
    if (balance < DEFAULT_THRESHOLD) {
      setShowReminder(true);
    } else {
      setShowReminder(false);
    }
  }, [currentUser?.wallet?.balance, DEFAULT_THRESHOLD]);

  const handleClose = () => {
    setShowReminder(false);
  };

  if (!showReminder) return null;
  // Hide the reminder if the user is not signed in or is not a client
  if (isSignedIn && currentUser?.role !== "CLIENT") {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      className="fixed bottom-4 right-4 w-fit shadow-lg"
    >
      <AlertCircle className="size-5 -mt-1" color="red" />
      <AlertTitle className="flex items-center justify-between">
        <p className="text-red-600 text-sm">Low Balance Warning</p>

        <X className="h-4 w-4" onClick={handleClose} />
      </AlertTitle>
      <AlertDescription className="text-sm">
        Your account balance is low. Please{" "}
        <span
          className="underline text-red-600 cursor-pointer"
          onClick={() => setIsTopupModalOpen(true)}
        >
          add funds.
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default BalanceReminder;
