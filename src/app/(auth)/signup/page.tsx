import Image from "next/image";
import React from "react";
import SignUpForm from "./_components/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden lg:block w-full relative">
        <Image
          fill
          src="/signupbg.jpg"
          alt="Image"
          className="object-cover"
          priority
        />
      </div>

      <div className="w-10/12 mx-auto h-full flex flex-col items-center justify-center gap-4 ">
        <p className="text-3xl font-bold">LOGO</p>

        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
