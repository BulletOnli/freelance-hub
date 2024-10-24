"use server";
import { createGig } from "@/data-access/gigs";
import { getCurrentUser } from "@/lib/sessions";
import { createGigSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { createServerAction } from "zsa";
import { isAfter } from "date-fns";

export const createGigAction = createServerAction()
  .input(createGigSchema)
  .handler(async ({ input }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Please login first");

    if (isAfter(new Date(), input?.deadline)) {
      throw new Error("Invalid Deadline");
    }

    const userBalance = user.wallet?.balance ?? 0;
    if (userBalance < input.budget) {
      throw new Error("Not Enough balance");
    }

    const gig = await createGig({ ...input, userId: user.id });
    revalidatePath("/gigs");
    return gig.id;
  });
