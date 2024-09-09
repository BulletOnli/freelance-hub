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
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignUpFormSchema } from "./SignUpForm";

type Props = {
  form: UseFormReturn<SignUpFormSchema>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const SecondStep = ({ form, setCurrentStep }: Props) => {
  return (
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

      <div className="w-full flex items-center justify-center gap-2 mx-auto">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setCurrentStep(1)}
        >
          Previous Step
        </Button>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </div>
    </>
  );
};

export default SecondStep;
