import { dbConnect } from "@/lib/dbConnect";
import Game from "@/lib/models/Game";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, context) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const game = await Game.findById(id).populate("teamA").populate("teamB");

    if (!game) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    // Check ownership
    if (game.createdBy.toString() !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return Response.json(game);
  } catch (err) {
    console.error("Game GET error:", err);
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, context) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const game = await Game.findById(id);

    if (!game) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    // Check ownership
    if (game.createdBy.toString() !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const updatedGame = await Game.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("teamA")
      .populate("teamB");

    return Response.json(updatedGame, { status: 200 });
  } catch (err) {
    console.error("Game PATCH error:", err);
    return Response.json(
      { error: err.message || "Failed to update game" },
      { status: 500 }
    );
  }
}
