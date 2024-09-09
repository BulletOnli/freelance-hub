"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import { UserRole } from "@prisma/client";

const SignUpRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);

  return (
    <>
      {role ? (
        <SignUpForm role={role} />
      ) : (
        <>
          <p>Choose your Role</p>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setRole(UserRole.CLIENT)}
              className="min-w-40"
            >
              Client
            </Button>
            <Button
              onClick={() => setRole(UserRole.FREELANCER)}
              className="min-w-40"
            >
              Freelancer
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default SignUpRole;
