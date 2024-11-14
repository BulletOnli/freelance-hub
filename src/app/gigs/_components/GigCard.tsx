import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { getCurrentUser } from "@/lib/sessions";
import { Applicant, FileUploadResponse, ModifiedGig } from "@/types";
import formatCurrency from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ShareButton from "./ShareButton";
import { env } from "@/env/client";
import ImagePreview from "@/components/ImagePreview";
import FilePreview from "@/components/FilePreview";

type Props = {
  gig: ModifiedGig & {
    applicants?: Applicant[] | [];
    files?: FileUploadResponse[];
  };
};

const GigCard = async ({ gig }: Props) => {
  const user = await getCurrentUser();

  const isAlreadyApplied = gig?.applicants?.some(
    (applicant) =>
      applicant.freelancer?.id === user?.id && applicant.status === "PENDING"
  );

  return (
    <div className="w-full max-w-[700px] p-4 flex flex-col gap-4 rounded-xl hover:shadow-sm bg-primary-custom border border-customBorder">
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
        {gig.status}
      </Badge>

      <Link href={`/gigs/${gig?.id}`}>
        <div className="space-y-2">
          <p className="font-semibold text-customDark">{gig?.title}</p>
          <p className="text-sm text-customSemiDark">{gig?.description}</p>
        </div>
      </Link>

      <div className="flex gap-4">
        {gig?.files?.map((file) => {
          if (file.url.endsWith(".pdf")) return null;

          return <ImagePreview key={file.key} file={file} />;
        })}
      </div>

      <div className="flex gap-4">
        {gig?.files?.map((file) => {
          if (!file.url.endsWith(".pdf")) return null;

          return <FilePreview key={file.key} file={file} />;
        })}
      </div>

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
                isOpen: !isAlreadyApplied && gig.status === "AVAILABLE",
              },
            }}
          >
            <Button
              className="rounded-full px-4"
              size="sm"
              disabled={gig.status !== "AVAILABLE" || isAlreadyApplied}
            >
              <BriefcaseBusiness className="mr-2 size-5" color="white" />

              {isAlreadyApplied ? "Already applied" : "Apply Now"}
            </Button>
          </Link>
        )}

        {user?.id !== gig?.userId && (
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
        )}

        <ShareButton
          link={`${env.NEXT_PUBLIC_BASE_URL}/gigs/${gig.id}`}
          size="sm"
          className="rounded-full px-4"
        />
      </div>
    </div>
  );
};

export default GigCard;
