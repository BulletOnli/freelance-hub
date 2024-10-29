import { getAllContracts } from "@/data-access/gig-contract";
import { User } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const TotalCompletedGigs = async ({ user }: { user: User }) => {
  let contracts = await getAllContracts("DONE", user?.id);

  if (user.role === "ADMIN") {
    contracts = await getAllContracts("DONE");
  }

  return (
    <div className="w-full bg-white lg:w-auto flex-1 flex flex-col gap-2 text-sm p-6 rounded-lg border border-slate-200">
      <p className="font-medium">Total Completed Gigs</p>
      <p className="text-2xl font-bold">{contracts?.length}</p>
      <Link href={"#"} className="flex items-center gap-1 group">
        <p className="text-customGray">View All</p>
        <ArrowRight
          className="size-5 group-hover:ml-[2px] group-hover:duration-100"
          color="#5d5d5d "
        />
      </Link>
    </div>
  );
};

export default TotalCompletedGigs;
