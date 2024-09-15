import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantCard from "./ApplicantCard";
import { Gig, GigApplicant } from "@prisma/client";

export type Applicant = GigApplicant & {
  freelancer: {
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
};

export type ModifiedGig = Gig & {
  user: {
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
  applicants: Applicant[] | [];
};

type Props = {
  gigData: ModifiedGig;
};

const GigApplicants = ({ gigData }: Props) => {
  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div className="absolute z-10 top-0 left-0 w-full h-full bg-white/40 backdrop-blur-sm"></div> */}
          <div className="flex flex-col gap-2">
            {gigData?.applicants?.length === 0 && <p>No applicants yet</p>}

            {gigData?.applicants?.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                gigData={gigData}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GigApplicants;
