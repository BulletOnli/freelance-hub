"use client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { useGlobalStore } from "@/stores/globalStore";

interface BalanceReminderProps {
  balance?: number;
}

const DEFAULT_THRESHOLD = 50;

const BalanceReminder = ({ balance = 100 }: BalanceReminderProps) => {
  const [showReminder, setShowReminder] = useState(false);
  const setIsTopupModalOpen = useGlobalStore(
    (state) => state.setIsTopupModalOpen
  );

  useEffect(() => {
    if (balance < DEFAULT_THRESHOLD) {
      setShowReminder(true);
    }
  }, [balance, DEFAULT_THRESHOLD]);

  const handleClose = () => {
    setShowReminder(false);
  };

  if (!showReminder) return null;

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
