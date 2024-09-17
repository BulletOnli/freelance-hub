import { getCurrentUser } from "@/lib/sessions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) redirect("/");

  return (
    <div className="w-full min-h-[calc(100vh-68px)] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden lg:block w-full relative">
        <Image fill src="" alt="Image" className="object-cover" priority />
      </div>

      {children}
    </div>
  );
}
