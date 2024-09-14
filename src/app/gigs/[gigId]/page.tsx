import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { GIGS_DATA } from "@/data";
import { getCurrentUser } from "@/lib/sessions";
import { BriefcaseBusiness, DollarSign, Mail, User } from "lucide-react";
import { redirect } from "next/navigation";
import ApplicantCard from "./_components/ApplicantCard";

type Applicant = {
  id: string;
  name: string;
};

const applicants: Applicant[] = [
  { id: "1", name: "Gemmuel Dela Pena" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Jane Smith" },
  { id: "4", name: "Alex Johnson" },
];

type Props = {
  params: { gigId: string };
};

const GigDetailsPage = async ({ params }: Props) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const gigsData = GIGS_DATA.find((gig) => gig.id === params.gigId);
  if (!gigsData) return;

  const { title, message, budget, images, status, userId } = gigsData;

  const statusColor = {
    available: "bg-green-500",
    ongoing: "bg-yellow-500",
    done: "bg-blue-500",
  };

  return (
    <div className="container mx-auto flex flex-wrap justify-center gap-6 px-4 py-8">
      <Card className="w-full max-w-4xl overflow-hidden">
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
          <Carousel className="w-full max-w-2xl mx-auto">
            <CarouselContent>
              {images.map((src, index) => (
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
          <div className="p-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground mb-4">{message}</p>
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
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full">
            <BriefcaseBusiness className="size-5 mr-2" color="white" />
            Apply
          </Button>
          <Button variant="outline" className="w-full">
            <Mail className="size-5 mr-2" />
            Contact Client
          </Button>
        </CardFooter>
      </Card>

      {/* Only show to the user who post/created this gig */}
      {user?.role === "CLIENT" && user?.id === userId && (
        <div className="w-full max-w-md flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {applicants?.map((applicant) => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GigDetailsPage;
