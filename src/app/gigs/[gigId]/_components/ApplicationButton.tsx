"use client";
import ApplicationModal from "@/components/ApplicationModal";
import { Button } from "@/components/ui/button";
import { isAfter } from "date-fns";
import React, { useEffect, useState } from "react";
import { useServerAction } from "zsa-react";
import { removeApplicationAction } from "../action";
import { toast } from "sonner";
import { BriefcaseBusiness } from "lucide-react";
import { Applicant, ModifiedGig, User } from "@/types";
import { useSearchParams } from "next/navigation";

type Props = {
  gigData: ModifiedGig & {
    applicants?: Applicant[] | [];
  };
  user: User;
};

const ApplicationButton = ({ gigData, user }: Props) => {
  const removeApplication = useServerAction(removeApplicationAction);
  const isPastDeadline = isAfter(new Date(), gigData?.deadline);
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAlreadyApplied = gigData?.applicants?.find(
    (applicant) =>
      applicant.freelancer?.id === user?.id && applicant.status === "PENDING"
  );

  const handleRemoveApplication = async () => {
    const [data, err] = await removeApplication.execute({
      applicationId: isAlreadyApplied?.id || "",
    });

    if (err) {
      console.log(err);
      return toast.error(err?.message || "Something went wrong!");
    }

    toast.success("Application removed!");
  };

  useEffect(() => {
    if (searchParams.get("isOpen") === "true") {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <>
      {isAlreadyApplied ? (
        <Button
          className="w-full"
          onClick={handleRemoveApplication}
          disabled={removeApplication.isPending}
        >
          Cancel application
        </Button>
      ) : (
        <ApplicationModal
          gigData={gigData}
          isModalOpen={isModalOpen}
          key={JSON.stringify(isModalOpen)} // This is the key to re-render the modal
        >
          <Button
            className="w-full"
            disabled={
              gigData.status !== "AVAILABLE" ||
              isAlreadyApplied ||
              isPastDeadline
            }
          >
            <BriefcaseBusiness className="mr-2 size-5" color="white" />
            Appy Now
          </Button>
        </ApplicationModal>
      )}
    </>
  );
};

export default ApplicationButton;
