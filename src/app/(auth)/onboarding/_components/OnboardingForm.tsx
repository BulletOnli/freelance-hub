"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import InputTags from "@/components/InputTags";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { onboardingSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BriefcaseBusiness, User } from "lucide-react";
import { UserRole } from "@prisma/client";
import { useServerAction } from "zsa-react";
import { onboardingAction } from "../../action";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type Onboarding = z.infer<typeof onboardingSchema>;

const OnboardingForm = () => {
  const router = useRouter();
  const { execute } = useServerAction(onboardingAction);
  const { user } = useUser();

  const form = useForm<Onboarding>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      role: UserRole.CLIENT,
    },
  });

  const onSubmit = async (values: Onboarding) => {
    const [data, err] = await execute({ ...values });

    if (err) return toast.error(err.message);

    await user?.reload();
    router.push("/done");
  };

  const role = form.watch("role");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-6"
      >
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold text-customDark">
            Select your Role {role}
          </p>
          <p className="text-customSemiDark">
            Are you a client looking to hire or a freelancer looking to work?
          </p>
        </div>

        <RadioGroup
          className="flex items-center gap-4"
          name="role"
          defaultValue={UserRole.CLIENT}
          onValueChange={(val: "FREELANCER" | "CLIENT") =>
            form.setValue("role", val)
          }
        >
          <div className="flex flex-col items-center gap-2">
            <Label
              htmlFor="ClientRadio"
              className="size-28 flex flex-col items-center justify-center gap-1 p-2 border border-borderColor rounded cursor-pointer"
            >
              <User className="size-6" />
              <p className="text-sm">Client</p>
            </Label>
            <RadioGroupItem value={UserRole.CLIENT} id="ClientRadio" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <Label
              htmlFor="FreelancerRadio"
              className="size-28 flex flex-col items-center justify-center gap-1 p-2 border border-borderColor rounded cursor-pointer"
            >
              <BriefcaseBusiness className="size-6" />
              <p className="text-sm">Freelancer</p>
            </Label>
            <RadioGroupItem value={UserRole.FREELANCER} id="FreelancerRadio" />
          </div>
        </RadioGroup>

        {role === "FREELANCER" && (
          <>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Enter Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bio"
                      {...field}
                      rows={8}
                      className="resize-none "
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Website Portfolio Link</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Portfolio URL" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>Select Specialization (Maximum of 5)</FormLabel>
                  <FormControl>
                    <InputTags form={form} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="w-full flex items-center justify-center gap-2 mx-auto">
          <Button type="submit" className="w-full">
            Finish Setup
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OnboardingForm;
