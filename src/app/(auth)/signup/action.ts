"use server";
import { createServerAction } from "zsa";
import z from "zod";
import { signUpSchema } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/sessions";

export const signUpAction = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    console.log("Success input", input);
    const userId = generateIdFromEntropySize(10);

    await prisma.user.create({
      data: {
        id: userId,
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        bio: input.bio,
        portfolio: input.portfolio,
        email: input.email,
        password: input.password,
        specialization: input.specialization,
        profilePicture: input.profilePicture,
      },
    });

    await createSession(userId);
  });
