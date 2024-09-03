import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalProvider from "@/context/GlobalProvider";
import SessionProvider from "@/context/SessionProvider";
import { validateRequest } from "@/auth";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <SessionProvider value={session}>{children}</SessionProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
