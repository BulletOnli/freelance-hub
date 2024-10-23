import React from "react";
import OngoingGigs from "./_components/OngoingGigs";
import WalletBalance from "./_components/WalletBalance";
import TotalEarnings from "./_components/TotalEarnings";
import TotalCompletedGigs from "./_components/TotalCompletedGigs";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";
import TransactionHistory from "./_components/TransactionHistory";

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-screen-xl 2xl:max-w-screen-2xl lg:h-screen2 flex flex-col lg:flex-row gap-6 p-4 lg:p-10 mx-auto">
      <div className="w-full lg:w-2/6 h-full flex flex-col gap-6">
        <TransactionHistory user={user} />
      </div>

      <div className="w-full lg:w-4/6 h-full flex flex-col gap-8">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          <TotalCompletedGigs user={user} />
          <TotalEarnings user={user} />
          <WalletBalance user={user} />
        </div>

        <OngoingGigs user={user} />
      </div>
    </div>
  );
};

export default DashboardPage;
