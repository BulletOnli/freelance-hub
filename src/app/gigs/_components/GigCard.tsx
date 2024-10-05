import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Mail, Send } from "lucide-react";
import Link from "next/link";
import React from "react";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import ApplicationModal from "@/components/ApplicationModal";
import { getCurrentUser } from "@/lib/sessions";
import { Applicant, ModifiedGig } from "@/types";
import formatCurrency from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  gig: ModifiedGig & {
    applicants?: Applicant[] | [];
  };
};

const GigCard = async ({ gig }: Props) => {
  const user = await getCurrentUser();
  const isPastDeadline = isAfter(new Date(), gig?.deadline);

  const isAlreadyApplied = gig?.applicants?.some(
    (applicant) =>
      applicant.freelancer?.id === user?.id && applicant.status === "PENDING"
  );

  // If the gig is available and the deadline has passed, set the status to EXPIRED
  const status =
    gig?.status === "AVAILABLE" && isPastDeadline ? "EXPIRED" : gig?.status;

  return (
    <div className="w-full max-w-[700px] p-4 flex flex-col gap-4 rounded-lg hover:bg-customLightGray/5">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={gig?.user?.profilePicture || undefined} />
          <AvatarFallback className="uppercase border border-customOrange text-darkGray font-semibold">
            {gig?.user?.firstName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-start">
          <p className="text-sm font-semibold text-customDark">
            {gig?.user?.firstName} {gig?.user?.lastName}
          </p>

          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger className="text-xs m-0 p-0">
                {formatDistanceToNow(gig?.createdAt, { addSuffix: true })}
              </TooltipTrigger>
              <TooltipContent className="bg-white text-customDark border">
                <p>{format(gig?.createdAt, "MMMM dd, yyyy hh:mm a")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Badge className="w-fit text-[12px]" variant="outline">
        {status}
      </Badge>

      <Link href={`/gigs/${gig?.id}`}>
        <div className="space-y-2">
          <p className="font-semibold text-customDark">{gig?.title}</p>
          <p className="text-sm text-customSemiDark">{gig?.description}</p>
        </div>
      </Link>

      <div>
        <div className="text-sm flex items-center gap-1">
          <p className="font-medium ">Budget: </p>
          <p>{formatCurrency(gig?.budget)}</p>
        </div>
        <div className="text-sm flex items-center gap-1">
          <p className="font-medium ">Deadline: </p>
          <p>{format(gig?.deadline, "MMMM dd, hh:mm a")}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 ">
        {user?.role === "FREELANCER" && (
          <Link
            href={{
              pathname: `/gigs/${gig?.id}`,
              query: {
                isOpen:
                  !isAlreadyApplied &&
                  !isPastDeadline &&
                  status === "AVAILABLE",
              },
            }}
          >
            <Button
              className="rounded-full px-4"
              size="sm"
              disabled={
                gig.status !== "AVAILABLE" || isPastDeadline || isAlreadyApplied
              }
            >
              <BriefcaseBusiness className="mr-2 size-5" color="white" />

              {isAlreadyApplied ? "Already applied" : "Apply Now"}
            </Button>
          </Link>
        )}
        <Button
          asChild
          variant="outline"
          className="rounded-full px-4"
          size="sm"
        >
          <Link href={`/chat/${gig.userId}`}>
            <Mail className="mr-2 size-5" />
            Message
          </Link>
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
