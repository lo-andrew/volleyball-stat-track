import { dbConnect } from "@/lib/dbConnect";
import Game from "@/lib/models/Game";

export async function GET(req, context) {
  await dbConnect();

  const { id } = await context.params;

  const game = await Game.findById(id).populate("teamA").populate("teamB");

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  return Response.json(game);
}
