"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import { UserRole } from "@prisma/client";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BriefcaseBusiness, User } from "lucide-react";
import Link from "next/link";

const DEFAULT_ROLE = UserRole.CLIENT;

const SignUpRole = () => {
  const [inputRole, setInputRole] = useState<UserRole>(DEFAULT_ROLE);
  const [role, setRole] = useState<UserRole | null>(null);

  const handleGoBack = () => {
    setRole(null);
    setInputRole(DEFAULT_ROLE);
  };

  if (role) {
    return <SignUpForm role={role} handleGoBack={handleGoBack} />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <p className="text-2xl font-bold text-customDark">Select your Role</p>
        <p className="text-customSemiDark">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, alias.
        </p>
      </div>

      <RadioGroup
        name="role"
        defaultValue={DEFAULT_ROLE}
        className="flex items-center gap-4"
        onValueChange={(val: UserRole) => setInputRole(val)}
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

      <Button className="w-full" onClick={() => setRole(inputRole)}>
        Continue
      </Button>

      <div className="text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-customDark hover:underline"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default SignUpRole;
