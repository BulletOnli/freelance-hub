import Image from "next/image";
import React from "react";
import SignUpForm from "./_components/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="w-full relative">
        <Image fill src="/signupbg.jpg" alt="Image" className="object-cover" />
      </div>

      <div className="w-full 2xl:w-3/4 mx-auto h-full flex flex-col items-center justify-center gap-4 p-4 md:p-10">
        <p className="text-3xl font-bold">LOGO</p>

        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
