import React from "react";
import ProfileDropDown from "../ProfileDropDown";
import { getCurrentUser } from "@/lib/sessions";
import Link from "next/link";
import { Briefcase } from "lucide-react";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="sticky top-0 z-50 w-full py-4 bg-customDark">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <Briefcase className="h-6 w-6" color="white" />
          <span className="ml-2 text-white text-lg font-semibold">
            FreelanceHub
          </span>
        </Link>

        <ProfileDropDown user={user} />
      </div>
    </div>
  );
};

export default Navbar;
