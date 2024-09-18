import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Mail, Send } from "lucide-react";
import Link from "next/link";
import React from "react";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import ApplicationModal from "@/components/ApplicationModal";
import { getCurrentUser } from "@/lib/sessions";
import { ModifiedGig } from "@/types";

type Props = {
  gig: ModifiedGig;
};

const GigCard = async ({ gig }: Props) => {
  const user = await getCurrentUser();
  const isPastDeadline = isAfter(new Date(), gig?.deadline);

  return (
    <div className="w-full max-w-[700px] p-4 flex flex-col gap-4 rounded-lg hover:bg-customLightGray/5">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={gig?.user?.profilePicture || undefined} />
          <AvatarFallback className="uppercase border border-customOrange text-darkGray font-semibold">
            {gig?.user?.firstName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-customDark">
            {gig?.user?.firstName} {gig?.user?.lastName}
          </p>
          <p className="text-xs">
            {formatDistanceToNow(gig?.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>

      <Link href={`/gigs/${gig?.id}`}>
        <div className="space-y-2">
          <p className="font-semibold text-customDark">{gig?.title}</p>
          <p className="text-sm text-customSemiDark">{gig?.description}</p>
        </div>
      </Link>

      <div>
        <div className="text-sm flex items-center gap-1">
          <p className="font-medium ">Budget: </p>
          <p>P{gig?.budget}</p>
        </div>
        <div className="text-sm flex items-center gap-1">
          <p className="font-medium ">Deadline: </p>
          <p>{format(gig?.deadline, "MMMM dd, hh:mm a")}</p>
        </div>
        <div className="text-sm flex items-center gap-1">
          <p className="font-medium ">Status: </p>
          <p>{gig?.status}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 ">
        {user?.role === "FREELANCER" && (
          <ApplicationModal gigData={gig}>
            <Button
              className="rounded-full px-4"
              size="sm"
              disabled={gig.status !== "AVAILABLE" || isPastDeadline}
            >
              <BriefcaseBusiness className="mr-2 size-5" color="white" />
              {isPastDeadline ? "Deadline Passed" : "Apply Now"}
            </Button>
          </ApplicationModal>
        )}
        <Button variant="outline" className="rounded-full px-4" size="sm">
          <Mail className="mr-2 size-5" />
          Message
        </Button>
        <Button variant="outline" className="rounded-full px-4" size="sm">
          <Send className="mr-2 size-5" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default GigCard;
