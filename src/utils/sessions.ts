import { lucia } from "@/auth";
import { Session } from "lucia";
import { cookies } from "next/headers";

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
