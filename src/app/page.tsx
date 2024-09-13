import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";

const Homepage = async () => {
  const user = await getCurrentUser();

  if (user && user.role === "FREELANCER") redirect(`/profile/${user.id}`);

  return <h1>hi</h1>;
  // return (
  //   <>
  //     {user ? (
  //       <div>
  //         <p>Welcome: {user?.email}</p>
  //       </div>
  //     ) : (
  //       <Button asChild>
  //         <Link href="/login">Login</Link>
  //       </Button>
  //     )}
  //   </>
  // );
};

export default Homepage;
