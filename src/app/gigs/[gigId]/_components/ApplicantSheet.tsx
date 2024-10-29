"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Applicant, ModifiedGig } from "@/types";
import formatCurrency from "@/utils/formatCurrency";
import { Check, ChevronRightIcon, X } from "lucide-react";
import Link from "next/link";
import { useServerAction } from "zsa-react";
import { acceptApplicationAction, removeApplicationAction } from "../action";
import { toast } from "sonner";

type Props = {
  applicants: Applicant[];
  gigData: ModifiedGig;
};

const ApplicantSheet = ({ applicants, gigData }: Props) => {
  return (
    <Sheet defaultOpen={applicants?.length !== 0}>
      <SheetTrigger>
        <div className="flex justify-center items-center gap-1 mt-2">
          <p className="text-sm">Load more</p>
          <ChevronRightIcon className="size-5" />
        </div>
      </SheetTrigger>
      <SheetContent className="bg-secondary-custom">
        <SheetHeader>
          <SheetTitle>Applicants</SheetTitle>
          <SheetDescription>
            Here you can find the details of all the applicants who have applied
            for this gig. Review their profiles and select the best fit for your
            project.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8 max-h-[85%] overflow-y-auto custom-scrollbar">
          {applicants.map((applicant) => (
            <ApplicantDetail
              key={applicant.id}
              applicant={applicant}
              gigData={gigData}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

type ApplicantDetail = {
  applicant: Applicant;
  gigData: ModifiedGig;
};

const ApplicantDetail = ({ applicant, gigData }: ApplicantDetail) => {
  const acceptApplication = useServerAction(acceptApplicationAction);
  const removeApplication = useServerAction(removeApplicationAction);

  const handleAccept = async () => {
    const [data, err] = await acceptApplication.execute({
      gigId: applicant.gigId,
      applicationId: applicant.id,
      clientId: gigData.userId,
      endDate: gigData.deadline,
      startDate: new Date(),
      freelancerId: applicant.freelancerId,
      price: applicant.price,
    });

    if (err) {
      console.log(err);
      return toast.error(err?.message || "Something went wrong!");
    }

    toast.success("Success, You can check the your contract here!");
  };

  const handleDecline = async () => {
    const [data, err] = await removeApplication.execute({
      applicationId: applicant.id,
    });

    if (err) {
      console.log(err);
      return toast.error(err?.message || "Something went wrong!");
    }

    toast.success("Applicantion removed!");
  };

  return (
    <div className="w-full bg-primary-custom border border-customBorder p-4 flex flex-col gap-4 rounded-lg ">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={applicant?.freelancer?.profilePicture || undefined}
          />
          <AvatarFallback className="uppercase border border-customOrange text-darkGray font-semibold">
            {applicant?.freelancer?.firstName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`/profile/${applicant?.freelancerId}`}
            className="font-semibold"
          >
            {applicant?.freelancer?.firstName} {applicant?.freelancer?.lastName}
          </Link>
          <p className="text-xs font-medium">
            Price Offer: {formatCurrency(applicant?.price)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm">{applicant?.message}</p>

        <div className="flex items-center gap-1 text-sm">
          <p className="text-sm font-semibold">Portfolio:</p>
          <Link
            target="_blank"
            href={applicant?.portfolio}
            className="hover:underline font-normal"
          >
            {applicant?.portfolio}
          </Link>
        </div>
      </div>

      <div className="w-full flex items-center gap-2">
        <Button
          className="w-full"
          size="sm"
          onClick={handleAccept}
          disabled={
            acceptApplication.isPending || gigData.status !== "AVAILABLE"
          }
        >
          <Check color="white" className="mr-1 size-5" />
          Accept
        </Button>
        <Button
          className="w-full"
          size="sm"
          variant="outline"
          onClick={handleDecline}
          disabled={
            removeApplication.isPending || gigData.status !== "AVAILABLE"
          }
        >
          <X className="mr-1 size-5" />
          Decline
        </Button>
      </div>
    </div>
  );
};

export default ApplicantSheet;
