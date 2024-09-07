import { validateRequest } from "@/auth";
import React from "react";
import LogoutBtn from "../components/LogoutBtn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Homepage = async () => {
  const session = await validateRequest();

  return (
    <>
      {session.user ? (
        <div>
          <p>Welcome: {session.user?.email}</p>
          <LogoutBtn />
        </div>
      ) : (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </>
  );
};

export default Homepage;
