import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    description: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.models?.Team || mongoose.model("Team", teamSchema);

export default Team;
