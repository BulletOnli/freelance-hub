import React from "react";
import GigCard from "./_components/GigCard";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";
import CreateGigModal from "./_components/CreateGigModal";
import { getAllGigs } from "@/data-access/gigs";

const GigsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const gigs = await getAllGigs();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-1 flex-col gap-8 p-10">
      {user.role === "CLIENT" && <CreateGigModal user={user} />}

      {gigs?.map((gig) => (
        <GigCard key={gig.id} gig={gig} />
      ))}

      {gigs?.length === 0 && (
        <p className="text-sm text-customGray text-center uppercase">
          No available gigs
        </p>
      )}
    </div>
  );
};

export default GigsPage;
