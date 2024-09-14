"use server";
import { createGig } from "@/data-access/gig";
import { getCurrentUser } from "@/lib/sessions";
import { createGigSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { createServerAction } from "zsa";

export const createGigAction = createServerAction()
  .input(createGigSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Please login first");

    const gig = await createGig({ ...input, userId: user.id });
    revalidatePath("/gigs");
    return gig.id;
  });
