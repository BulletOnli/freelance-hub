import React from "react";
import ProfileDropDown from "../ProfileDropDown";
import { getCurrentUser } from "@/lib/sessions";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="sticky top-0 w-full py-4 text-white bg-customDark">
      <div className="container mx-auto flex items-center justify-between">
        <div>sdf</div>

        <ProfileDropDown user={user} />
      </div>
    </div>
  );
};

export default Navbar;
