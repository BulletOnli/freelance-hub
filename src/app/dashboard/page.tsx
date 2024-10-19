import React from "react";
import OngoingGigs from "./_components/OngoingGigs";
import WalletBalance from "./_components/WalletBalance";
import TotalEarnings from "./_components/TotalEarnings";
import TotalCompletedGigs from "./_components/TotalCompletedGigs";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-screen-xl 2xl:max-w-screen-2xl h-screen2 flex gap-6 p-10 mx-auto">
      <div className="w-2/6 h-full flex flex-col gap-6">
        <OngoingGigs user={user} />
      </div>

      <div className="w-4/6 h-full flex flex-col gap-6">
        <div className="w-full flex items-center justify-between gap-4">
          <TotalCompletedGigs user={user} />
          <TotalEarnings user={user} />
          <WalletBalance user={user} />
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default DashboardPage;
