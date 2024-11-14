import React, { Fragment } from "react";
import GigCard from "./_components/GigCard";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";
import CreateGigModal from "./_components/CreateGigModal";
import { getAllGigs } from "@/data-access/gigs";

const GigsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const gigs = await getAllGigs("AVAILABLE");

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-1 flex-col gap-6 p-4 sm:p-10 sm:pb-20">
      {gigs?.map((gig, index) => (
        <Fragment key={gig.id}>
          <GigCard gig={gig} />
          {index < gigs.length - 1 && (
            <div className="w-full h-px bg-customBorder"></div>
          )}
        </Fragment>
      ))}

      {gigs?.length === 0 && (
        <p className="text-sm text-customGray text-center uppercase">
          No available gigs
        </p>
      )}

      {user.role === "CLIENT" && (
        <div className="w-full fixed bottom-0 left-0 bg-gradient-to-t from-white to-white/0 p-6">
          <div className="w-full max-w-3xl mx-auto">
            <CreateGigModal user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GigsPage;
