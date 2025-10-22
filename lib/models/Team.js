import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    description: { type: String },
  },
  { timestamps: true }
);

const Team = mongoose.models?.Team || mongoose.model("Team", teamSchema);

export default Team;
