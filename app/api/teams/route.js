import { dbConnect } from "@/lib/dbConnect";
import Team from "@/lib/models/Team";

export async function GET() {
  await dbConnect();
  const teams = await Team.find().populate("players");
  return Response.json(teams);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const newTeam = await Team.create(data);
  return Response.json(newTeam, { status: 201 });
}
