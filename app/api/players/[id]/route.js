import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";

export async function GET(req, { params }) {
  await dbConnect();
  const playerId = (await params).id; // ✅ Correctly await params

  const player = await Player.findById(playerId).populate("team");
  if (!player) {
    return Response.json({ error: "Player not found" }, { status: 404 });
  }

  return Response.json(player);
}
