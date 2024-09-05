import React from "react";
import LoginForm from "./_components/LoginForm";

const LoginPage = () => {
  return (
    <div className="w-10/12 mx-auto h-full flex flex-col items-center justify-center gap-4 ">
      <p className="text-3xl font-bold">Login</p>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
