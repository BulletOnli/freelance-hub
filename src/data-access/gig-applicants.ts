import prisma from "@/lib/prisma";
import { GIG_APPLICATION_STATUS } from "@prisma/client";

type ApplyToGigInputs = {
  gigId: string;
  freelancerId: string;
  price: number;
  message: string;
  portfolio: string;
};

export const applyToGig = async (input: ApplyToGigInputs) => {
  return await prisma.gigApplicant.create({
    data: {
      gigId: input.gigId,
      freelancerId: input.freelancerId,
      price: input.price,
      message: input.message,
      portfolio: input.portfolio,
    },
  });
};

export const updateApplicationStatus = async ({
  applicationId,
  status,
}: {
  applicationId: string;
  status: GIG_APPLICATION_STATUS;
}) => {
  return await prisma.gigApplicant.update({
    where: {
      id: applicationId,
    },
    data: { status },
  });
};
