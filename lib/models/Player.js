// lib/models/Player.js
import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: {
      type: String,
      enum: ["setter", "libero", "outside", "middle", "opposite", "ds"],
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

export default mongoose.models.Player || mongoose.model("Player", playerSchema);
