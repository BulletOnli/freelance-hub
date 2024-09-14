"use server";

import { getUserProfile } from "@/data-access/users";
import { z } from "zod";
import { createServerAction } from "zsa";

export const getUserProfileAction = createServerAction()
  .input(
    z.object({
      id: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    const userProfile = await getUserProfile(input.id);

    return userProfile;
  });
