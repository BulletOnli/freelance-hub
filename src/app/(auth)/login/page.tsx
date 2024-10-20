import React from "react";
import LoginForm from "./_components/LoginForm";
import Link from "next/link";
import { Briefcase } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="w-full max-w-xl mx-auto h-full flex flex-col items-center justify-center gap-8">
      <div className="w-full space-y-2">
        <Link className="w-fit flex items-center mb-4" href="#">
          <Briefcase className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">FreelanceHub</span>
        </Link>

        <p className="text-3xl font-bold">Welcome back!</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio,
          nemo!
        </p>
      </div>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
