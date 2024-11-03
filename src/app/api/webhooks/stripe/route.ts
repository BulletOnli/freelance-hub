import { createTransaction } from "@/data-access/transactions";
import { incrementWalletBalance } from "@/data-access/wallets";
import { env } from "@/env/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature") as string;

  try {
    let event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    if (!event) {
      throw new Error("Invalid event");
    }

    if (event.type === "checkout.session.completed") {
      const data = event.data.object;
      if (data.payment_status === "paid") {
        const totalAmount = (data.amount_total || 0) / 100;
        // @ts-expect-error
        const { userId, walletId } = data.metadata;

        await createTransaction({
          description: "Cash In via Stripe",
          amount: totalAmount,
          type: "DEBIT",
          status: "SUCCESS",
          walletId,
        });

        // Increment the amount to the users's wallet
        await incrementWalletBalance({ userId, amount: totalAmount });

        return Response.json(
          { received: true, event: event.type },
          { status: 200 }
        );
      }
    }

    return Response.json(
      {
        received: true,
        event: event.type,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return Response.json(
      { error: error.message || "An error occured" },
      { status: 400 }
    );
  }
}
