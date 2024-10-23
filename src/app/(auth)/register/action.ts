"use server";
import { createServerAction } from "zsa";
import z from "zod";
import { freelancerSchema, studentSignUpSchema } from "@/lib/validation";
// import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import argon2 from "argon2";
import {
  createClientUser,
  createFreelancerUser,
  isEmailAlreadyTaken,
} from "@/data-access/users";

export const checkUserProfile = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input }) => {
    const { email } = input;

    try {
      const existingUser = await isEmailAlreadyTaken(email);

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

export const studentSignUpAction = createServerAction()
  .input(studentSignUpSchema)
  .handler(async ({ input }) => {
    // const userId = generateIdFromEntropySize(10);

    try {
      const hashedPassword = await argon2.hash(input.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        hashLength: 50,
      });

      await createClientUser({
        ...input,
        id: userId,
        password: hashedPassword,
      });

      // await createSession(userId);
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  });

export const freelanacerSignUpAction = createServerAction()
  .input(freelancerSchema)
  .handler(async ({ input }) => {
    // const userId = generateIdFromEntropySize(10);

    try {
      const hashedPassword = await argon2.hash(input.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        hashLength: 50,
      });

      await createFreelancerUser({
        ...input,
        id: userId,
        password: hashedPassword,
      });

      // await createSession(userId);
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  });
