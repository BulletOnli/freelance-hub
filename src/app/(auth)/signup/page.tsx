import Image from "next/image";
import React from "react";
import SignUpForm from "./_components/SignUpForm";
import SignUpRole from "./_components/SignUpRole";

const SignUpPage = () => {
  return (
    <div className="w-10/12 mx-auto h-full flex flex-col items-center justify-center gap-4 ">
      <p className="text-3xl font-bold">LOGO</p>

      {/* <SignUpForm /> */}
      <SignUpRole />
    </div>
  );
};

export default SignUpPage;
