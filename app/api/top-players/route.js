import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";
import StatLine from "@/lib/models/StatLine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function computeLifetimeStats(statlines = []) {
  let kills = 0,
    totalAttempt = 0,
    error = 0;
  statlines.forEach((s) => {
    kills += s.kills?.kill || 0;
    totalAttempt += s.kills?.totalAttempt || 0;
    error += s.kills?.error || 0;
  });
  const hittingPercentage =
    totalAttempt > 0 ? ((kills - error) / totalAttempt) * 100 : 0;
  return { kills, totalAttempt, error, hittingPercentage };
}

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const players = await Player.find({ createdBy: session.user.id });
    const playerStats = await Promise.all(
      players.map(async (player) => {
        const statlines = await StatLine.find({
          player: player._id,
          createdBy: session.user.id,
        });
        const stats = computeLifetimeStats(statlines);
        return {
          _id: player._id,
          name: player.name,
          stats,
        };
      })
    );
    // Sort by hitting percentage descending, take top 3
    const topPlayers = playerStats
      .filter((p) => p.stats.totalAttempt > 0)
      .sort((a, b) => b.stats.hittingPercentage - a.stats.hittingPercentage)
      .slice(0, 3);
    return Response.json(topPlayers);
  } catch (err) {
    console.error("Top players GET error:", err);
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
