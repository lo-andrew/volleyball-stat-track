import { dbConnect } from "@/lib/dbConnect";
import Team from "@/lib/models/Team";
import Player from "@/lib/models/Player";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teams = await Team.find({ createdBy: session.user.id });

    return Response.json(teams);
  } catch (error) {
    console.error("Teams GET error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const newTeam = await Team.create({
      ...data,
      createdBy: session.user.id,
    });
    return Response.json(newTeam, { status: 201 });
  } catch (error) {
    console.error("Teams POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create team" },
      { status: 500 }
    );
  }
}
