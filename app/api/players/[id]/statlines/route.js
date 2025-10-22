import { dbConnect } from "@/lib/dbConnect";
import StatLine from "@/lib/models/StatLine";

export async function GET(req, { params }) {
  await dbConnect();

  const statlines = await StatLine.find({ player: params.id })
    .populate("game") // populate the game so you can show date & teams
    .populate({
      path: "game",
      populate: ["teamA", "teamB"], // populate the teams inside game
    });

  return new Response(JSON.stringify(statlines), { status: 200 });
}
