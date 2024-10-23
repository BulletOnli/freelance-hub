"use client";
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { confirmTransactionAction } from "../action";
import { toast } from "sonner";

const CompleteTransaction = ({ gigId }: { gigId: string }) => {
  const [open, setOpen] = useState(false);
  const { isPending, execute } = useServerAction(confirmTransactionAction);

  const handleConfirm = async () => {
    const [data, err] = await execute({ gigId });
    if (err) {
      console.log(err);
      return toast.error(err?.message || "Something went wrong!");
    }
    toast.success("Transaction completed!");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full">Confirm and Pay</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm and Pay</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to authorize payment for the completed work. Please
            ensure you have thoroughly reviewed the deliverables and are
            satisfied with the quality before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteTransaction;
