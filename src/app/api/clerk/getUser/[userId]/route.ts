import { clerkClient } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await clerkClient().users.getUser(params.userId);
    return Response.json(user, { status: 200 });
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
