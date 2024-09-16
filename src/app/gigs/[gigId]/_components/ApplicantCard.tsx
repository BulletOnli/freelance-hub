"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GIG_APPLICATION_STATUS, GigApplicant } from "@prisma/client";
import { Check } from "lucide-react";
import React from "react";
import { acceptApplicationStatusAction } from "../../action";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { Applicant, ModifiedGig } from "@/types";

const ApplicantCard = ({
  applicant,
  gigData,
}: {
  applicant: Applicant;
  gigData: ModifiedGig;
}) => {
  const { isPending, execute } = useServerAction(acceptApplicationStatusAction);

  const handleAccept = async (status: GIG_APPLICATION_STATUS) => {
    const [data, err] = await execute({
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

    toast.success("Application Accpted, You can check the your contract here");
  };

  return (
    <div className="flex items-center justify-between p-3 bg-customLightGray/10 hover:bg-customLightGray/20 rounded-lg">
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
          <span className="font-medium">
            {applicant?.freelancer?.firstName} {applicant?.freelancer?.lastName}
          </span>
          <p className="text-xs">Price Offer: {applicant?.price}</p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => handleAccept("PENDING")}
        disabled={isPending || gigData.status !== "AVAILABLE"}
      >
        <Check className="mr-2 h-4 w-4" color="white" />
        Accept
      </Button>
    </div>
  );
};

export default ApplicantCard;
