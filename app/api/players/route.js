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

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let data;
    try {
      data = await req.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!data.name) {
      return new Response(
        JSON.stringify({ error: "Player name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newPlayer = await Player.create({
      ...data,
      createdBy: session.user.id,
    });

    return new Response(JSON.stringify(newPlayer), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error creating player:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to create player" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
