import { getContractDetails } from "@/data-access/gig-contract";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "date-fns";
import PdfContract from "./PdfContract";
import { getCurrentUser } from "@/lib/sessions";
import formatCurrency from "@/utils/formatCurrency";

const ContractDetails = async ({ gigId }: { gigId: string }) => {
  const contract = await getContractDetails(gigId);
  if (!contract) return null;

  const user = await getCurrentUser();
  // If the current user is not the client, freelancer, or admin, return null
  if (
    contract.client.id !== user?.id &&
    contract.freelancer.id !== user?.id &&
    user?.role !== "ADMIN"
  ) {
    return null;
  }

  const renderPersonInfo = (person: typeof contract.client, role: string) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">{role}</h3>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={person.profilePicture || undefined}
            alt={`${person.firstName} ${person.lastName}`}
          />
          <AvatarFallback>
            {person.firstName[0]}
            {person.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {person.firstName} {person.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{person.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <Card className=" w-full mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Contract Details
            </CardTitle>
            <PdfContract contract={contract} />
          </div>
        </CardHeader>
        <CardContent id="gig-contract">
          <div className="grid grid-cols-2 gap-4">
            {renderPersonInfo(contract.client, "Client")}
            {renderPersonInfo(contract.freelancer, "Freelancer")}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contract ID
              </p>
              <p className="text-sm">{contract.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Gig ID
              </p>
              <p className="text-sm">{contract.gigId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <p className="text-sm uppercase font-semibold text-green-600">
                {contract.status}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="text-sm font-semibold">
                {formatCurrency(contract.price)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Start Date
              </p>
              <p className="text-sm">
                {contract.startDate &&
                  formatDate(contract.startDate, "MMMM dd, yyyy hh:mm a")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                End Date
              </p>
              <p className="text-sm">
                {contract.endDate &&
                  formatDate(contract.endDate, "MMMM dd, yyyy hh:mm a")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractDetails;
