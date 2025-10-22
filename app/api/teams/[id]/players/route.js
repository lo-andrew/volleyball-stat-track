// app/api/teams/[id]/players/route.js
import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";

export async function GET(req, context) {
  await dbConnect();

  const { id } = await context.params;
  const players = await Player.find({ team: id }).populate("team");
  const uniquePlayers = Array.from(
    new Map(players.map((p) => [p._id.toString(), p])).values()
  );

  return Response.json(uniquePlayers);
}
