import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="w-full max-w-xl mx-auto h-full flex items-center justify-center">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
