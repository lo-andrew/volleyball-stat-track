import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    pointsA: Number,
    pointsB: Number,
    set: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Game || mongoose.model("Game", GameSchema);
