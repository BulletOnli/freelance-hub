import { getCurrentUser } from "@/lib/sessions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) redirect("/dashboard");

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 p-4">
      <div className="hidden lg:block w-full relative rounded-xl overflow-hidden">
        <Image
          fill
          src="/images/login.jpg"
          alt="Image"
          className="object-cover"
          priority
        />
      </div>

      {children}
    </div>
  );
}
