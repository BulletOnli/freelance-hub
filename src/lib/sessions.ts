import { lucia, validateRequest } from "@/auth";
import { Session } from "lucia";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { getLoggedInUser } from "@/data-access/users";
import { auth, currentUser } from "@clerk/nextjs/server";

export const getCurrentUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  // const session = await validateRequest();
  // if (!session.user) return null;

  const user = await getLoggedInUser(userId);
  return user;
});

export const createSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export const clearSession = async (sessionId: string) => {
  await lucia.invalidateSession(sessionId);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export async function logoutAction(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await clearSession(session.id);

  return redirect("/login", RedirectType.replace);
}

interface ActionResult {
  error: string | null;
}
