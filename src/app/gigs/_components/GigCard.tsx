import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Mail, Send } from "lucide-react";
import Link from "next/link";
import React from "react";

const GigCard = () => {
  return (
    <div className="w-full max-w-[700px] p-4 flex flex-col gap-4 rounded-lg hover:bg-customLightGray/5">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={undefined} />
          <AvatarFallback className="border border-customOrange text-darkGray font-semibold">
            A
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`/profile/1`}
            className="hover:underline text-sm font-semibold text-customDark"
          >
            <p>Colet Vergara</p>
          </Link>
          <p className="text-xs">2 minutes ago</p>
        </div>
      </div>

      <Link href={`/gigs/1`}>
        <div className="space-y-2">
          <p className="font-semibold text-customDark">
            Lorem ipsum dolor sit amet consectetur. Nibh risus nec velit et.
            Morbi at in a tortor arcu eu.
          </p>

          <p className="text-sm text-customSemiDark">
            Lorem ipsum dolor sit amet consectetur. Diam quam id amet amet leo
            et. Bibendum et habitasse vulputate quam pellentesque. Pharetra
            adipiscing lectus purus ornare porta sagittis quam nunc aliquam. Sit
            porta pretium sagittis elit magna diam blandit elit bibendum. Amet
            lectus nisi amet mattis imperdiet imperdiet porttitor scelerisque.
            Morbi sit.
          </p>
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-2 ">
        <Button className="rounded-full px-4" size="sm">
          <BriefcaseBusiness className="mr-2 size-5" color="white" />
          Apply Now
        </Button>
        <Button variant="outline" className="rounded-full px-4" size="sm">
          <Mail className="mr-2 size-5" />
          Message
        </Button>
        <Button variant="outline" className="rounded-full px-4" size="sm">
          <Send className="mr-2 size-5" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default GigCard;
