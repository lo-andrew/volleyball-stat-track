"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import StatButton from "@/components/StatButton";

export default function AddStatLinePage() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then(setPlayers);

    fetch("/api/games")
      .then((res) => res.json())
      .then(setGames);
  }, []);

  const formik = useFormik({
    initialValues: {
      player: "",
      game: "",
      kills: { kill: 0, totalAttempt: 0, error: 0 },
      serves: { ace: 0, attempts: 0, error: 0, zero: 0 },
      digs: 0,
      blocks: { solo: 0, assist: 0, error: 0, zero: 0 },
      general: { ballError: 0, setsPlayed: 0 },
      reception: { errors: 0, attempt: 0 },
    },
    onSubmit: async (values, { resetForm }) => {
      const res = await fetch("/api/statlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        alert("StatLine added!");
        resetForm();
      } else {
        alert("Error adding statline");
      }
    },
  });

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Player StatLine</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        {/* Player */}
        <div>
          <label className="block font-medium mb-1">Player</label>
          <select
            name="player"
            className="select select-bordered w-full"
            onChange={formik.handleChange}
            value={formik.values.player}
            required
          >
            <option value="">Select Player</option>
            {players.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Game */}
        <div>
          <label className="block font-medium mb-1">Game</label>
          <select
            name="game"
            className="select select-bordered w-full"
            onChange={formik.handleChange}
            value={formik.values.game}
            required
          >
            <option value="">Select Game</option>
            {games.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name || g.date}
              </option>
            ))}
          </select>
        </div>

        {/* Stat boxes */}
        <div className="grid grid-cols-3 gap-6">
          {/* kills */}
          <h3>Kills</h3>
          {Object.entries(formik.values.kills).map(([field, value]) => (
            <StatButton
              key={field}
              category="kills"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}

          {/* serves */}
          <h3>Serves</h3>
          {Object.entries(formik.values.serves).map(([field, value]) => (
            <StatButton
              key={field}
              category="serves"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}

          {/* blocks */}
          <h3>Blocks</h3>
          {Object.entries(formik.values.blocks).map(([field, value]) => (
            <StatButton
              key={field}
              category="blocks"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}

          {/* digs */}
          <h3>Digs</h3>
          <StatButton
            category="digs"
            field="digs"
            value={formik.values.digs}
            setFieldValue={formik.setFieldValue}
          />
            
          {/* general */}
          <h3>General</h3>
          {Object.entries(formik.values.general).map(([field, value]) => (
            <StatButton
              key={field}
              category="general"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}

          {/* reception */}
          <h3>Reception</h3>
          {Object.entries(formik.values.reception).map(([field, value]) => (
            <StatButton
              key={field}
              category="reception"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}

          {/* Repeat for other stats */}
        </div>

        {/* Repeat similarly for serves, blocks, reception, general */}
        {/* You can group them visually with <fieldset> if needed */}

        <button type="submit" className="btn btn-primary w-full">
          Add StatLine
        </button>
      </form>
    </main>
  );
}
