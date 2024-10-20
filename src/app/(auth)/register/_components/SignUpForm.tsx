"use client";
import { Form } from "@/components/ui/form";
import { freelancerSchema, studentSignUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import { useServerAction } from "zsa-react";
import { freelanacerSignUpAction, studentSignUpAction } from "../action";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export type SignUpFormSchema =
  | z.infer<typeof freelancerSchema>
  | z.infer<typeof studentSignUpSchema>;

type Props = {
  role: UserRole;
  handleGoBack: () => void;
};

const SignUpForm = ({ role, handleGoBack }: Props) => {
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
    <div className="w-full space-y-6">
      <div className="w-full space-y-2">
        <div
          className="text-sm flex items-center gap-2 mb-6 cursor-pointer"
          onClick={() => handleGoBack()}
        >
          <ArrowLeft className="size-5" />
          <p className="font-medium">Go Back</p>
        </div>

        <Link className="w-fit flex items-center mb-4" href="#">
          <Briefcase className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">FreelanceHub</span>
        </Link>

        <p className="text-3xl font-bold">Create an account</p>
        <div className="text-sm mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-customDark hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-2"
        >
          {currentStep === 1 && (
            <FirstStep
              form={form}
              setCurrentStep={setCurrentStep}
              role={role}
            />
          )}

          {currentStep === 2 && (
            <SecondStep form={form} setCurrentStep={setCurrentStep} />
          )}
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
