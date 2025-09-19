// lib/models/Game.js
import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    setsWonA: Number,
    setsWonB: Number,
    statLines: [{ type: mongoose.Schema.Types.ObjectId, ref: "StatLine" }],
  },
  { timestamps: true }
);

export default mongoose.models.Game || mongoose.model("Game", GameSchema);
