import { dbConnect } from "@/lib/dbConnect";
import StatLine from "@/lib/models/StatLine";
import Game from "@/lib/models/Game";
import Team from "@/lib/models/Team";

export async function GET(req, { params }) {
  await dbConnect();
  const playerId = (await params).id; // ✅ Correctly await params

  const statlines = await StatLine.find({ player: playerId }).populate({
    path: "game",
    populate: [
      { path: "teamA", model: "Team" },
      { path: "teamB", model: "Team" },
    ],
  });

  return Response.json(statlines);
}
