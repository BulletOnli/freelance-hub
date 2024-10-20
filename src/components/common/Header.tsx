"use client";
import React, { PropsWithChildren } from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/register"];

const Header = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) return null;

  return (
    <div className="sticky top-0 z-50 w-full py-4 bg-customDark">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <Briefcase className="h-6 w-6" color="white" />
          <span className="ml-2 text-white text-lg font-semibold">
            FreelanceHub
          </span>
        </Link>

        {children}
      </div>
    </div>
  );
};

export default Header;
