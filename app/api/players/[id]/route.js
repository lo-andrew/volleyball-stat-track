import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";

export async function GET(req, { params }) {
  await dbConnect();

  const player = await Player.findById(params.id).populate("team");
  if (!player) {
    return new Response(JSON.stringify({ error: "Player not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(player), { status: 200 });
}
