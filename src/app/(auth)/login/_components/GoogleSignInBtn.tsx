import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const GoogleSignInBtn = () => {
  return (
    <Button asChild>
      <Link href="/login/google">Sign in with Google</Link>
    </Button>
  );
};

export default GoogleSignInBtn;
