import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Applicant, ModifiedGig } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatCurrency from "@/utils/formatCurrency";
import ApplicantSheet from "./ApplicantSheet";
import Link from "next/link";

type Props = {
  gigData: ModifiedGig & {
    applicants: Applicant[] | [];
  };
};

const GigApplicants = ({ gigData }: Props) => {
  return (
    <div className="w-full max-w-xs flex flex-col gap-4">
      <Card className="p-4 space-y-4">
        <CardHeader className="p-0">
          <CardTitle>Applicants</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col gap-2">
            {gigData?.applicants?.length === 0 && <p>No applicants yet</p>}

            <div className="flex flex-col gap-3 mt-2">
              {gigData?.applicants?.map((applicant) => (
                <div key={applicant.id} className="flex items-center gap-2">
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
                      className="font-medium"
                    >
                      {applicant?.freelancer?.firstName}{" "}
                      {applicant?.freelancer?.lastName}
                    </Link>
                    <p className="text-xs">
                      Price Offer: {formatCurrency(applicant?.price)}
                    </p>
                  </div>
                </div>
              ))}

              {gigData?.applicants?.length > 0 && (
                <ApplicantSheet
                  applicants={gigData?.applicants}
                  gigData={gigData}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GigApplicants;
