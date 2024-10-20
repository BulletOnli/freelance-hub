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
import { DollarSign, Mail, User } from "lucide-react";
import { redirect } from "next/navigation";
import { getGigDetails } from "@/data-access/gigs";
import GigApplicants from "./_components/GigApplicants";
import ApplicationButton from "./_components/ApplicationButton";
import CompleteTransaction from "./_components/CompleteTransaction";
import ContractDetails from "./_components/ContractDetails";
import { cn } from "@/lib/utils";
import NotFound from "@/app/not-found";
import formatCurrency from "@/utils/formatCurrency";
import Link from "next/link";

type Props = {
  params: { gigId: string };
};

const statusColor = {
  AVAILABLE: "bg-green-500",
  ONGOING: "bg-yellow-500",
  DONE: "bg-blue-500",
};

const GigDetailsPage = async ({ params }: Props) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const gigData = await getGigDetails(params.gigId);
  if (!gigData) return <NotFound />;

  const { title, description, budget, files, status, userId } = gigData;

  // If the user viewed their created GIG
  const isUsersGig = user?.role === "CLIENT" && user?.id === userId;

  return (
    <div
      className={cn(
        user?.role === "CLIENT" ? "max-w-6xl" : "max-w-5xl",
        "container  mx-auto flex flex-col gap-8 px-4 py-8"
      )}
    >
      <ContractDetails gigId={params.gigId} />

      <div className="flex flex-col lg:flex-row justify-center gap-4">
        <Card className="w-full h-fit overflow-hidden">
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
                <p className="text-2xl font-bold">{formatCurrency(budget)}</p>

                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>Client ID: {userId}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {!isUsersGig ? (
              <>
                {user?.role === "FREELANCER" && (
                  <ApplicationButton gigData={gigData} user={user} />
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/chat/${userId}`}>
                    <Mail className="size-5 mr-2" />
                    Message Client
                  </Link>
                </Button>
              </>
            ) : (
              <>
                {status === "ONGOING" && (
                  <CompleteTransaction gigId={params.gigId} />
                )}
              </>
            )}
          </CardFooter>
        </Card>

        {status === "AVAILABLE" && isUsersGig && (
          <GigApplicants gigData={gigData} />
        )}
      </div>
    </div>
  );
};

export default GigDetailsPage;
