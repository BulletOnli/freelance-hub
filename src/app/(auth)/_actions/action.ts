"use server";
import { redirect, RedirectType } from "next/navigation";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { generateIdFromEntropySize } from "lucia";
import { clearSession, createSession } from "@/lib/sessions";

export async function logout(): Promise<ActionResult> {
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

// export async function signup(
//   _: any,
//   formData: FormData
// ): Promise<ActionResult> {
//   const userId = generateIdFromEntropySize(10);

//   await prisma.user.create({
//     data: {
//       id: userId,
//       displayName: formData.get("displayName") as string,
//       username: formData.get("username") as string,
//     },
//   });

//   await createSession(userId);

//   return redirect("/");
// }

interface ActionResult {
  error: string | null;
}
