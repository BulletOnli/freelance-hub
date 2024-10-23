import React from "react";
import OnboardingForm from "./_components/OnboardingForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.onboardingComplete) {
    redirect("/test");
  }

  return (
    <div className="w-full max-w-xl mx-auto h-full flex flex-col items-center justify-center gap-6">
      <OnboardingForm />
    </div>
  );
};

export default OnboardingPage;
