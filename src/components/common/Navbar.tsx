import React from "react";
import ProfileDropDown from "../ProfileDropDown";
import { getCurrentUser } from "@/lib/sessions";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="sticky top-0 z-50 w-full py-4 bg-customDark">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white uppercase">Freelance app</div>

        <ProfileDropDown user={user} />
      </div>
    </div>
  );
};

export default Navbar;
