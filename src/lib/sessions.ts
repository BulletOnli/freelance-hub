import { cache } from "react";
import { getLoggedInUser } from "@/data-access/users";
import { auth } from "@clerk/nextjs/server";

export const getCurrentUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await getLoggedInUser(userId);
  return user;
});
