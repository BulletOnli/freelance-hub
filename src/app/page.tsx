import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";

const Homepage = async () => {
  const user = await getCurrentUser();

  redirect("/gigs");
  if (user && user?.role === "FREELANCER") redirect(`/profile/${user?.id}`);
};

export default Homepage;
