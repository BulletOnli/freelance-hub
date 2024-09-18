"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createGigSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useServerAction } from "zsa-react";
import { createGigAction } from "../action";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format, formatISO } from "date-fns";
import { MINIMUM_GIG_PRICE } from "@/constants";
import { User } from "@/types";

type FormValues = z.infer<typeof createGigSchema>;

export default function CreateGigModal({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const { isPending, execute } = useServerAction(createGigAction);

  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);

  const form = useForm<FormValues>({
    resolver: zodResolver(createGigSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: MINIMUM_GIG_PRICE,
      deadline: format(nextDay, "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const onSubmit = async (values: FormValues) => {
    const [data, err] = await execute(values);
    if (err) {
      return toast.error(err?.message || "Something went wrong!");
    }

    toast.success("Successfully created a Gig!");
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-full">Create a Gig</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Gig</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter gig title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter gig description"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter budget"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, 16)}
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              Create Gig
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
