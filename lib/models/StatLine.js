// lib/models/StatLine.js
import mongoose from "mongoose";

const StatLineSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    kills: {
      kill: { type: Number, default: 0 },
      totalAttempt: { type: Number, default: 0 },
      error: { type: Number, default: 0 },
    },
    serves: {
      ace: { type: Number, default: 0 },
      attempts: { type: Number, default: 0 },
      error: { type: Number, default: 0 },
      zero: { type: Number, default: 0 }, // in-play serve
    },
    // FIXED: Rename the nested object to avoid confusion
    digStats: {
      successful: { type: Number, default: 0 },
      error: { type: Number, default: 0 },
    },
    blocks: {
      solo: { type: Number, default: 0 },
      assist: { type: Number, default: 0 },
      error: { type: Number, default: 0 },
      zero: { type: Number, default: 0 },
    },
    general: {
      ballError: { type: Number, default: 0 },
    },
    reception: {
      attempt: { type: Number, default: 0 },
      zero: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.StatLine ||
  mongoose.model("StatLine", StatLineSchema);
