import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const players = await Player.find({ createdBy: session.user.id }).populate(
      "team"
    );

    return new Response(JSON.stringify(players), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching players:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to fetch players" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
