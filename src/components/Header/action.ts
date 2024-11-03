"use server";
import { createCheckoutSession, createPrice, stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerAction } from "zsa";

export const checkoutAction = createServerAction()
  .input(
    z.object({
      priceId: z.string().optional(),
      redirectUrl: z.string().optional(),
      customPrice: z.number().optional(),
    })
  )
  .handler(async ({ input }) => {
    let { priceId, redirectUrl, customPrice } = input;

    if (customPrice) {
      const price = await createPrice(customPrice * 100);
      if (!price) throw new Error("Failed to create price");
      priceId = price.id;
    }

    if (!priceId) {
      throw new Error("Price ID is required");
    }

    const session = await createCheckoutSession({ priceId, redirectUrl });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return session.url;
  });
