import { dbConnect } from "@/lib/dbConnect";
import StatLine from "@/lib/models/StatLine";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("player");

  let query = {};
  if (playerId) query.player = playerId;

  const statlines = await StatLine.find(query)
    .populate("player")
    .populate("game");

  return Response.json(statlines);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const newStatLine = await StatLine.create(data);
  return Response.json(newStatLine, { status: 201 });
}
