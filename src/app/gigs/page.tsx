import React from "react";
import GigCard from "./_components/GigCard";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateGigModal from "./_components/CreateGigModal";
import { getAllGigs } from "@/data-access/gigs";

const GigsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const gigs = await getAllGigs();

  return (
    <div className="w-full h-screen2 p-10 flex justify-between gap-8">
      <div className="w-full max-w-xs bg-slate-50"></div>

      <div className="max-w-3xl overflow-auto flex flex-1 flex-col gap-8">
        <div className="w-full flex items-center justify-center gap-2">
          <Button disabled variant="outline" className="w-full rounded-full">
            Unknown
          </Button>
          {user.role === "CLIENT" && <CreateGigModal user={user} />}

          <Button disabled variant="outline" className="w-full rounded-full">
            Unknown
          </Button>
        </div>

        {gigs?.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}

        {gigs?.length === 0 && (
          <p className="text-sm text-customGray text-center uppercase">
            No available gigs
          </p>
        )}
      </div>

      <div className="w-full max-w-xs bg-slate-50"></div>
    </div>
  );
};

export default GigsPage;
