import { dbConnect } from "@/lib/dbConnect";
import Game from "@/lib/models/Game";
import Team from "@/lib/models/Team";

// GET all games (with populated teams + statlines)
export async function GET() {
  await dbConnect();
  const games = await Game.find().populate("teamA").populate("teamB");
  return Response.json(games);
}

// POST create a new game
export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const newGame = await Game.create(data);
  return Response.json(newGame, { status: 201 });
}
