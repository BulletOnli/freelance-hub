"use server";

import { getUserDetails } from "@/data-access/users";
import { z } from "zod";
import { createServerAction } from "zsa";

export const getUserDetailsAction = createServerAction()
  .input(
    z.object({
      id: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    const userDetails = await getUserDetails(input.id);

    return userDetails;
  });
