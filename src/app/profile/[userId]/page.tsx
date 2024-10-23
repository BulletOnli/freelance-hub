import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/sessions";
import { BadgeCheck, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import React from "react";
import { getUserProfileAction } from "./action";
import Error from "@/app/error";
import Link from "next/link";
import NotFound from "@/app/not-found";

type Props = {
  params: { userId: string };
};

const UserProfilePage = async ({ params }: Props) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role === "CLIENT" && user.id === params.userId)
    redirect("/", RedirectType.replace);

  const [data, err] = await getUserProfileAction({ id: params.userId });

  if (!data) return <NotFound />;
  if (err) return <Error />;

  if (data.role === "CLIENT") redirect("/", RedirectType.replace);

  return (
    <div className="container mx-auto p-4 sm:p-10 flex items-center">
      <div className="w-full flex flex-col gap-16">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <Avatar className="size-40 text-4xl">
              <AvatarImage src={data?.profilePicture || undefined} />
              <AvatarFallback className="border border-customOrange text-darkGray font-semibold">
                {data?.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="size-5" />
                <p>Philippines</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <p className="text-2xl font-semibold">
                  {data?.firstName} {data?.lastName}
                </p>
                <Badge className="bg-green-600 hover:bg-green-600 select-none">
                  <BadgeCheck color="white" className="size-4 mr-1" />
                  Verified
                </Badge>
              </div>

              <p className="text-sm text-customGray font-medium">
                Portfolio:{" "}
                <Link
                  href={data?.profile?.portfolio || "#"}
                  target="_blank"
                  className="hover:underline font-normal"
                >
                  {data?.profile?.portfolio}
                </Link>
              </p>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-customGray font-medium">
                  Specialization:
                </p>
                <div className="flex select-none text-xs flex-wrap items-center gap-2">
                  {data?.profile?.specialization?.slice(0, 3)?.map((skill) => (
                    <p
                      key={skill}
                      className="px-4 py-[2px] border border-customGray rounded-full"
                    >
                      {skill}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-2">
            <div className="flex items-center gap-6">
              <Badge className="bg-green-600 hover:bg-green-600 select-none">
                <BadgeCheck color="white" className="size-4 mr-1" />
                Top Rated
              </Badge>
              <div className=" flex items-center gap-1">
                <Star fill="" color="black" className="size-5" />
                <p className="font-semibold">4.8</p>
                <p className="text-customLightGray">(1.6k)</p>
              </div>
            </div>
            <Button size="sm" className="bg-customDark hover:bg-customDark/95">
              <Phone color="white" className="mr-2 size-5" />
              Book now
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-customDark hover:bg-customDark/95"
            >
              <Link href={`/chat/${params.userId}`}>
                <Mail color="white" className="mr-2 size-5" />
                Message
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">About me</p>
            <p className="text-customGray">{data?.profile?.bio}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">Skills</p>
            <div className="flex  text-sm flex-wrap items-center gap-2">
              {data?.profile?.specialization?.slice(0, 3)?.map((skill) => (
                <p
                  key={skill}
                  className="px-4 py-1 border border-customGray rounded-full"
                >
                  {skill}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
