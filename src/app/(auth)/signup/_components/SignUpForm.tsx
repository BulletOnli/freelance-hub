"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { freelancerSchema, studentSignUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import { useServerAction } from "zsa-react";
import { freelanacerSignUpAction, studentSignUpAction } from "../action";
import { UserRole } from "@prisma/client";

export type SignUpFormSchema =
  | z.infer<typeof freelancerSchema>
  | z.infer<typeof studentSignUpSchema>;

const SignUpForm = ({ role }: { role: UserRole }) => {
  const isClientRole = role === "CLIENT";
  const [currentStep, setCurrentStep] = useState(1);

  const { execute } = useServerAction(
    isClientRole ? studentSignUpAction : freelanacerSignUpAction
  );

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(
      isClientRole ? studentSignUpSchema : freelancerSchema
    ),
    defaultValues: {},
  });

  const onSubmit = async (values: SignUpFormSchema) => {
    const [data, err] = await execute({ ...values });
    // console.log("Data", data);
    // console.log("Error", err);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        {currentStep === 1 && (
          <FirstStep form={form} setCurrentStep={setCurrentStep} role={role} />
        )}

        {currentStep === 2 && (
          <SecondStep form={form} setCurrentStep={setCurrentStep} />
        )}
      </form>
    </Form>
  );
};

export default SignUpForm;
