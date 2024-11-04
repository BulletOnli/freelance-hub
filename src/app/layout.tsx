import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import GlobalProvider from "@/providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/common/Sidebar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ClerkProvider } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/sessions";
import BalanceReminder from "@/components/BalanceReminder";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freelance Hub",
  description:
    "Freelance Hub - Your go-to platform for managing freelance projects efficiently.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-secondary-custom`}>
          <GlobalProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

            <Header />
            {children}
            <Sidebar />
            {user && user.role === "CLIENT" && (
              <BalanceReminder balance={user?.wallet?.balance} />
            )}

            <Toaster closeButton />
            {/* <ReactQueryDevtools /> */}
          </GlobalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
