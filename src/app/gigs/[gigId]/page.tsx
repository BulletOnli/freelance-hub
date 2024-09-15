import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getCurrentUser } from "@/lib/sessions";
import { BriefcaseBusiness, DollarSign, Mail, User } from "lucide-react";
import { redirect } from "next/navigation";
import { getGigDetails } from "@/data-access/gigs";
import ApplicationModal from "@/components/ApplicationModal";
import GigApplicants from "./_components/GigApplicants";

type Props = {
  params: { gigId: string };
};

const GigDetailsPage = async ({ params }: Props) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const gigData = await getGigDetails(params.gigId);
  if (!gigData) return;

  const { title, description, budget, files, status, userId } = gigData;

  const statusColor = {
    AVAILABLE: "bg-green-500",
    ONGOING: "bg-yellow-500",
    DONE: "bg-blue-500",
  };

  // If the user viewed their created GIG
  const isUsersGig = user?.role === "CLIENT" && user?.id === userId;

  return (
    <div className="container mx-auto flex flex-wrap justify-center gap-6 px-4 py-8">
      <Card className="w-full max-w-4xl h-fit overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {title}
          </CardTitle>
          <Badge
            className={`${statusColor[status]} text-white w-fit uppercase`}
          >
            {status}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {files?.length !== 0 && (
            <Carousel className="w-full max-w-2xl mx-auto">
              <CarouselContent>
                {files.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={src}
                        alt={`Gig image ${index + 1}`}
                        className="w-full aspect-video object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
          <div className="p-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground mb-4">{description}</p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <DollarSign className="mr-1 h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{budget}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>Client ID: {userId}</span>
              </div>
            </div>
          </div>
        </CardContent>
        {!isUsersGig && (
          <CardFooter className="flex flex-col gap-2">
            {user?.role === "FREELANCER" && (
              <ApplicationModal gigId={params?.gigId}>
                <Button
                  className="w-full"
                  disabled={gigData.status !== "AVAILABLE"}
                >
                  <BriefcaseBusiness className="mr-2 size-5" color="white" />
                  Apply Now
                </Button>
              </ApplicationModal>
            )}
            <Button variant="outline" className="w-full">
              <Mail className="size-5 mr-2" />
              Contact Client
            </Button>
          </CardFooter>
        )}
      </Card>

      {isUsersGig && <GigApplicants gigData={gigData} />}
    </div>
  );
};

export default GigDetailsPage;
