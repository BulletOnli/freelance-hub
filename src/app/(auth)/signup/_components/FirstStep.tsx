"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profilePicSchema, signUpSchema } from "@/lib/validation";
import { UploadButton } from "@/utils/uploadthing";
import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { checkUserDetails } from "../action";

type Props = {
  form: UseFormReturn<z.infer<typeof signUpSchema>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const FirstStep = ({ form, setCurrentStep }: Props) => {
  const [imagePreview, setImagePreview] = useState("");
  const checkUserDetailAction = useServerAction(checkUserDetails);

  const handleNextStep = async () => {
    const [email] = form.getValues(["email"]);

    const [data, err] = await checkUserDetailAction.execute({
      email,
    });

    if (err) {
      form.setError("email", {
        message: "Email already taken",
      });
      return;
    }

    const isValid = await form.trigger([
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "profilePicture",
    ]);

    if (form.getValues("password") !== form.getValues("confirmPassword")) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords don't match",
      });
      return;
    }

    if (isValid) {
      setCurrentStep(2);
    } else {
      console.log("Validation error");
    }
  };

  useEffect(() => {
    if (form.getValues("profilePicture")) {
      setImagePreview(form.getValues("profilePicture"));
    }
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input placeholder="Enter valid email address" {...field} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Enter Username" {...field} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      /> */}

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter your Password"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Confirm your Password"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profilePicture"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="flex items-center gap-4 my-2">
                <div className="relative">
                  <Avatar className="size-16 ">
                    <AvatarImage src={imagePreview} className="object-cover" />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  {imagePreview && (
                    <Button
                      onClick={() => {
                        setImagePreview("");
                        form.resetField("profilePicture");
                      }}
                      variant="outline"
                      size="icon"
                      className="size-6 absolute rounded-full -top-2 right-0 "
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>

                <UploadButton
                  className="mt-4 ut-button:bg-slate-900 ut-button:ut-readying:bg-slate-900/50 "
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    form.setValue("profilePicture", res[0].url);
                    setImagePreview(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    form.setError("profilePicture", {
                      message: "Maximum of 4MB only",
                    });
                  }}
                />

                <FormMessage className="text-xs" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <Button
        type="button"
        disabled={checkUserDetailAction.isPending}
        onClick={handleNextStep}
        className="w-full"
      >
        Next Step
      </Button>
    </>
  );
};

export default FirstStep;
