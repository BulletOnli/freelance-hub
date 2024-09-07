"use server";
import { createServerAction } from "zsa";
import z from "zod";
import { signUpSchema } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/sessions";
import argon2 from "argon2";

export const checkUserDetails = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input }) => {
    const { email } = input;

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }],
        },
        select: {
          id: true,
          email: true,
        },
      });

      if (existingUser?.email === email) {
        throw new Error("Email already exists");
      }

      return { message: "User details are valid" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        console.error("Unknown error occurred:", error);
        throw new Error("Something went wrong");
      }
    }
  });

export const signUpAction = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    const userId = generateIdFromEntropySize(10);

    try {
      const response = await prisma.user.create({
        data: {
          id: userId,
          // username: input.username,
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

      console.log(response);
      await createSession(userId);
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  });
