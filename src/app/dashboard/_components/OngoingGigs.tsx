import { getAllContracts } from "@/data-access/gig-contract";
import { User } from "@/types";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const OngoingGigs = async ({ user }: { user: User }) => {
  const contracts = await getAllContracts("ONGOING", user?.id);

  return (
    <div className="space-y-4 h-full p-4 rounded-lg bg-white border border-slate-200">
      <p className="font-medium">Ongoing Gigs</p>

      <div className="space-y-4">
        {contracts?.length === 0 && (
          <p className="text-customGray text-sm text-center">No ongoing gigs</p>
        )}

        {contracts?.map((contract) => (
          <Link
            key={contract.id}
            href={`/gigs/${contract?.gig?.id}`}
            className="flex items-center gap-4"
          >
            <div className="flex-1 flex items-center gap-2">
              <div className="size-16 bg-secondary-custom flex flex-col justify-center items-center border border-customBorder rounded-lg">
                <p className="font-semibold">
                  {contract?.endDate && format(contract?.endDate, "MMM")}
                </p>
                <p className="font-semibold">
                  {contract?.endDate && format(contract?.endDate, "dd")}
                </p>
              </div>

              <div>
                <p className="font-medium">{contract?.gig?.title}</p>
                <p className="text-customGray text-sm">
                  {contract?.gig?.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {contracts?.length >= 3 && (
        <Link
          href={"#"}
          className="flex items-center justify-center gap-1 group mx-auto"
        >
          <p className="text-customGray">View All</p>
          <ArrowRight
            className="relative size-5 group-hover:translate-x-1 duration-100 transition-transform transform"
            color="#5d5d5d "
          />
        </Link>
      )}
    </div>
  );
};

export default OngoingGigs;
