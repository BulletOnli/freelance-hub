import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const prices = await stripe.prices.list({
      active: true,
      currency: "php",
    });

    return Response.json(prices?.data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && (error as any).status === 404) {
      return Response.json(null, { status: 404 });
    }

    return Response.json(
      {
        error: {
          message: "Internal Server Error",
        },
      },
      { status: 500 }
    );
  }
}
