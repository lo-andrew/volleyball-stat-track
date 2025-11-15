import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const playerId = (await params).id;

    const player = await Player.findById(playerId).populate("team");
    if (!player) {
      return Response.json({ error: "Player not found" }, { status: 404 });
    }

    // Check ownership
    if (player.createdBy.toString() !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return Response.json(player);
  } catch (err) {
    console.error("Player GET error:", err);
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const player = await Player.findById(id);

    if (!player) {
      return Response.json({ error: "Player not found" }, { status: 404 });
    }

    // Check ownership
    if (player.createdBy.toString() !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const updatedPlayer = await Player.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return Response.json(updatedPlayer, { status: 200 });
  } catch (err) {
    console.error("Player PUT error:", err);
    return Response.json(
      { error: err.message || "Failed to update player" },
      { status: 500 }
    );
  }
}
