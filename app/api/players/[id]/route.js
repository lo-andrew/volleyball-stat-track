import { dbConnect } from "@/lib/dbConnect";
import Player from "@/lib/models/Player";

export async function GET(req, { params }) {
  await dbConnect();
  const playerId = (await params).id; // ✅ Correctly await params

  const player = await Player.findById(playerId).populate("team");
  if (!player) {
    return Response.json({ error: "Player not found" }, { status: 404 });
  }

  return Response.json(player);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const data = await req.json();

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlayer) {
      return new Response(JSON.stringify({ message: "Player not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedPlayer), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update player" }), {
      status: 500,
    });
  }
}
