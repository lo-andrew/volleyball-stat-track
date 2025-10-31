import { dbConnect } from "@/lib/dbConnect";
import Team from "@/lib/models/Team";
import Player from "@/lib/models/Player"; // ensure Player model is registered for populate

export async function GET(req, ctx) {
  try {
    await dbConnect();

    const params = ctx?.params ? await ctx.params : {};
    const { id } = params || {};
    if (!id) {
      return Response.json({ error: "Missing team id" }, { status: 400 });
    }

    const team = await Team.findById(id);

    if (!team) {
      return Response.json({ error: "Team not found" }, { status: 404 });
    }

    const players = await Player.find({ team: id }).select("name position");

    const teamWithPlayers = {
      ...team.toObject(),
      players,
    };

    return Response.json(teamWithPlayers);
  } catch (err) {
    console.error("Team GET error:", err);
    return Response.json(
      { error: err.message || "server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, ctx) {
  try {
    await dbConnect();

    const params = ctx?.params ? await ctx.params : {};
    const { id } = params || {};
    if (!id)
      return Response.json({ error: "Missing team id" }, { status: 400 });

    let data;
    try {
      data = await req.json();
    } catch (err) {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, description, players } = data;

    const team = await Team.findById(id);
    if (!team)
      return Response.json({ error: "Team not found" }, { status: 404 });

    if (typeof name === "string") team.name = name;
    if (typeof description === "string") team.description = description;

    if (Array.isArray(players)) {
      team.players = players;

      const previousPlayers = await Player.find({ team: id }).select(
        "_id team"
      );
      const previousIds = previousPlayers.map((p) => String(p._id));
      const newIds = players.map((p) => String(p));
      const toAdd = newIds.filter((nid) => !previousIds.includes(nid));
      const toRemove = previousIds.filter((pid) => !newIds.includes(pid));

      if (toAdd.length > 0) {
        await Player.updateMany(
          { _id: { $in: toAdd } },
          { $addToSet: { team: id } }
        );
      }

      // Remove team id from deselected players
      if (toRemove.length > 0) {
        await Player.updateMany(
          { _id: { $in: toRemove } },
          { $pull: { team: id } }
        );
      }
    }

    await team.save();

    // Return updated team with players
    const playersList = await Player.find({ team: id }).select("name position");
    const result = { ...team.toObject(), players: playersList };
    return Response.json(result);
  } catch (err) {
    console.error("Team PATCH error:", err);
    return Response.json(
      { error: err.message || "server error" },
      { status: 500 }
    );
  }
}
