import { getCurrentUser } from "@/lib/sessions";
import { redirect, RedirectType } from "next/navigation";

const Profile = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in", RedirectType.replace);

  redirect(`/profile/${user.id}`, RedirectType.replace);
};

export default Profile;
