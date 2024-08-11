"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/validation";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type Props = {
  form: UseFormReturn<z.infer<typeof signUpSchema>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const FirstStep = ({ form, setCurrentStep }: Props) => {
  const handleNextStep = async () => {
    const isValid = await form.trigger([
      "firstName",
      "lastName",
      "email",
      "username",
      "password",
      "confirmPassword",
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

      <FormField
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
      />

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

      <Button type="button" onClick={handleNextStep} className="w-full">
        Next Step
      </Button>
    </>
  );
};

export default FirstStep;
