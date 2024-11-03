import { getLoggedInUser } from "@/data-access/users";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getLoggedInUser(userId);

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
