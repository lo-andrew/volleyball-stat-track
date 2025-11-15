import { dbConnect } from "@/lib/dbConnect";
import Game from "@/lib/models/Game";
import Team from "@/lib/models/Team";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET all games for current user
export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const games = await Game.find({ createdBy: session.user.id })
      .populate("teamA")
      .populate("teamB");
    return Response.json(games);
  } catch (err) {
    console.error("Games GET error:", err);
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new game
export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const newGame = await Game.create({
      ...data,
      createdBy: session.user.id,
    });

    // Bump usage metrics for involved teams (only for teams owned by this user)
    try {
      const teamIds = [];
      if (data.teamA) teamIds.push(data.teamA);
      if (data.teamB) teamIds.push(data.teamB);
      if (teamIds.length > 0) {
        await Team.updateMany(
          { _id: { $in: teamIds }, createdBy: session.user.id },
          { $inc: { usageCount: 1 }, $set: { lastUsedAt: new Date() } }
        );
      }
    } catch (metricErr) {
      console.error("Failed to update team usage metrics:", metricErr);
    }

    return Response.json(newGame, { status: 201 });
  } catch (err) {
    console.error("Games POST error:", err);
    return Response.json(
      { error: err.message || "Failed to create game" },
      { status: 500 }
    );
  }
}
