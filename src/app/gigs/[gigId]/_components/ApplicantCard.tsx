"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import React from "react";

type Applicant = {
  id: string;
  name: string;
};

const ApplicantCard = ({ applicant }: { applicant: Applicant }) => {
  const handleAccept = (applicantId: string) => {
    console.log(`Accepted applicant with ID: ${applicantId}`);
    // Implement your accept logic here
  };

  return (
    <div className="flex items-center justify-between p-3 bg-customLightGray/10 hover:bg-customLightGray/20 rounded-lg">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={undefined} />
          <AvatarFallback className="uppercase border border-customOrange text-darkGray font-semibold">
            {applicant.name[0]}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{applicant.name}</span>
      </div>
      <Button size="sm" onClick={() => handleAccept(applicant.id)}>
        <Check className="mr-2 h-4 w-4" color="white" />
        Accept
      </Button>
    </div>
  );
};

export default ApplicantCard;
