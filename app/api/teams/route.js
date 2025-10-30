import { dbConnect } from "@/lib/dbConnect";
import Team from "@/lib/models/Team";
import Player from "@/lib/models/Player"; // Import Player model to ensure it's registered

export async function GET() {
  try {
    await dbConnect();
    // First get teams without populate to ensure they exist
    const teams = await Team.find();

    if (!teams) {
      console.error("No teams found or database error");
      return Response.json({ error: "Failed to fetch teams" }, { status: 500 });
    }

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
    const data = await req.json();
    const newTeam = await Team.create(data);
    return Response.json(newTeam, { status: 201 });
  } catch (error) {
    console.error("Teams POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create team" },
      { status: 500 }
    );
  }
}
