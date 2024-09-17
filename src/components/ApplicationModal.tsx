"use client";
import { PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useServerAction } from "zsa-react";
import { applyToGigAction } from "@/app/gigs/action";
import { createGigApplicationSchema } from "@/lib/validation";
import { toast } from "sonner";
import { ModifiedGig } from "@/types";
import { MINIMUM_GIG_PRICE } from "@/constants";

type FormValues = z.infer<typeof createGigApplicationSchema>;

type Props = {
  gigData: ModifiedGig;
} & PropsWithChildren;

export default function ApplicationModal({ children, gigData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, execute } = useServerAction(applyToGigAction);

  const form = useForm<FormValues>({
    resolver: zodResolver(createGigApplicationSchema),
    defaultValues: {
      price: MINIMUM_GIG_PRICE,
      message: "",
      portfolio: "",
      gigId: gigData?.id,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const [data, err] = await execute({
      ...values,
      gigId: gigData?.id,
    });

    if (err) {
      return toast.error(err?.message || "Something went wrong!");
    }

    toast.success("Success! Wait for the client's approval");
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Application</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere,
            doloremque.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Offer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      required
                      min={MINIMUM_GIG_PRICE}
                      max={gigData?.budget}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why are you the best fit for this project?"
                      className="resize-none"
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
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Link</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://your-portfolio.com"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
