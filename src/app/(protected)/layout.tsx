import { validateRequest } from "@/auth";
import { redirect, RedirectType } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  if (!session.user) redirect("/login", RedirectType.replace);

  return <>{children}</>;
}
