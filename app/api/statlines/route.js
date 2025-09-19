import { dbConnect } from "@/lib/dbConnect";
import StatLine from "@/lib/models/StatLine";

// GET all statlines (with player + game populated)
export async function GET() {
  await dbConnect();
  const statlines = await StatLine.find().populate("player").populate("game");
  return Response.json(statlines);
}

// POST create a new statline
export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const newStatLine = await StatLine.create(data);
  return Response.json(newStatLine, { status: 201 });
}
