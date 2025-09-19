import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";
import Team from "@/lib/models/Team";

// GET all players
export async function GET() {
  await dbConnect();
  const players = await Player.find().populate("team");
  return Response.json(players);
}

// POST create a new player
export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const newPlayer = await Player.create(data);
  return Response.json(newPlayer, { status: 201 });
}
