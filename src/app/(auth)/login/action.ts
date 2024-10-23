"use server";
import { validateLogin } from "@/data-access/users";
import { loginSchema } from "@/lib/validation";
import { createServerAction } from "zsa";

export const loginAction = createServerAction()
  .input(loginSchema)
  .handler(async ({ input }) => {
    const userId = await validateLogin(input);

    if (!userId) {
      throw new Error("Invalid username or password");
    }

    // await createSession(userId);
  });
