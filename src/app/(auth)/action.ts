"use server";
import prisma from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServerAction } from "zsa";

const updateOnboardingStatus = async (userId: string) => {
  const user = await clerkClient().users.updateUser(userId, {
    publicMetadata: { onboardingComplete: true },
  });
  if (!user) throw new Error("Failed to complete onboarding");
};

export const onboardingAction = createServerAction()
  .input(onboardingSchema)
  .handler(async ({ input }) => {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { role: input.role },
      });

      if (input.role === "CLIENT") {
        await updateOnboardingStatus(userId);
        return { message: "Client onboarding complete" };
      }

      await prisma.userProfile.create({
        data: {
          userId,
          bio: input.bio!,
          portfolio: input.portfolio!,
          specialization: input.specialization,
        },
      });

      await updateOnboardingStatus(userId);
      return { message: "Freelancer onboarding complete" };
    } catch (error) {
      console.error("Onboarding error:", error);
      throw new Error("Failed to complete onboarding");
    }
  });
