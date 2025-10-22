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
  try {
    await dbConnect();
    const data = await req.json();

    console.log("Received data:", JSON.stringify(data, null, 2));

    // Create a clean statline object with proper nested structure
    // NOTE: Use digStats instead of digs to match your schema
    const statLineData = {
      player: data.player,
      game: data.game,
      kills: data.kills || { kill: 0, totalAttempt: 0, error: 0 },
      serves: data.serves || { ace: 0, attempts: 0, error: 0, zero: 0 },
      digStats: data.digStats || { successful: 0, error: 0 }, // CHANGED: digs -> digStats
      blocks: data.blocks || { solo: 0, assist: 0, error: 0, zero: 0 },
      general: data.general || { ballError: 0 },
      reception: data.reception || { attempt: 0, zero: 0, errors: 0 },
    };

    console.log("Processed data:", JSON.stringify(statLineData, null, 2));

    const newStatLine = await StatLine.create(statLineData);
    return Response.json(newStatLine, { status: 201 });
  } catch (error) {
    console.error("Error creating statline:", error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}
