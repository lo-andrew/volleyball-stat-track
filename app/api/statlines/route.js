import { dbConnect } from "@/lib/dbConnect";
import StatLine from "@/lib/models/StatLine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get("player");

    let query = { createdBy: session.user.id };
    if (playerId) query.player = playerId;

    const statlines = await StatLine.find(query)
      .populate("player")
      .populate("game");

    return Response.json(statlines);
  } catch (err) {
    console.error("Statlines GET error:", err);
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const statLineData = {
      player: data.player,
      game: data.game,
      kills: data.kills || { kill: 0, totalAttempt: 0, error: 0 },
      serves: data.serves || { ace: 0, attempts: 0, error: 0, zero: 0 },
      digStats: data.digStats || { successful: 0, error: 0 },
      blocks: data.blocks || { solo: 0, assist: 0, error: 0, zero: 0 },
      general: data.general || { ballError: 0 },
      reception: data.reception || { attempt: 0, zero: 0, errors: 0 },
      createdBy: session.user.id,
    };

    const newStatLine = await StatLine.create(statLineData);
    return Response.json(newStatLine, { status: 201 });
  } catch (error) {
    console.error("Error creating statline:", error);
    return Response.json(
      { error: error.message || "Failed to create statline" },
      { status: 400 }
    );
  }
}
