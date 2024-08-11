"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { signUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

const SignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {},
  });

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        {currentStep === 1 && (
          <FirstStep form={form} setCurrentStep={setCurrentStep} />
        )}

        {currentStep === 2 && (
          <SecondStep form={form} setCurrentStep={setCurrentStep} />
        )}
      </form>
    </Form>
  );
};

export default SignUpForm;
