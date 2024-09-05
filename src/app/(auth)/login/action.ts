"use server";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/sessions";
import { loginSchema } from "@/lib/validation";
import { z } from "zod";
import { createServerAction } from "zsa";

export const loginAction = createServerAction()
  .input(loginSchema)
  .handler(async ({ input }) => {
    const user = await prisma.user.findFirst({
      where: {
        email: input.email,
        password: input.password,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    await createSession(user.id);
  });
