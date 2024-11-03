import { env as ClientEnv } from "@/env/client";
import { env as ServerEnv } from "@/env/server";
import Stripe from "stripe";
import { getCurrentUser } from "./sessions";

export const stripe = new Stripe(ServerEnv.STRIPE_SECRET_KEY);

export const createPrice = async (amount: number) => {
  const price = await stripe.prices.create({
    unit_amount: amount,
    currency: "php",
    product_data: {
      name: "Virtual Coins",
    },
  });

  return price;
};

type CheckoutSession = {
  priceId: string;
  redirectUrl?: string;
};

export const createCheckoutSession = async ({
  priceId,
  redirectUrl,
}: CheckoutSession) => {
  redirectUrl = `${ClientEnv.NEXT_PUBLIC_BASE_URL}${redirectUrl}`;
  const user = await getCurrentUser();

  if (!user?.wallet) {
    throw new Error("Unauthorized");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${redirectUrl}?success=true`,
    cancel_url: `${redirectUrl}?canceled=true`,
    metadata: {
      userId: user.id,
      walletId: user.wallet.id,
    },
  });

  return session;
};
