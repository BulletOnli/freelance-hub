import { validateRequest } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden lg:block w-full relative">
        <Image
          fill
          src="/signupbg.jpg"
          alt="Image"
          className="object-cover"
          priority
        />
      </div>

      {children}
    </div>
  );
}
