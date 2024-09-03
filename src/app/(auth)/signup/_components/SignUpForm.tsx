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
import { useServerAction } from "zsa-react";
import { signUpAction } from "../action";

const SignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { isPending, execute, data, error } = useServerAction(signUpAction);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const [data, err] = await execute(values);
    console.log("Data", data);
    console.log("Error", err);
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
