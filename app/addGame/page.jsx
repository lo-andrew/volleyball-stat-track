"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";

export default function AddGame() {
  const [teams, setTeams] = useState([]);

  const sortTeams = (list) => {
    // work on a shallow copy and coerce types so sorting is stable
    const normalized = (list || []).map((t) => ({
      ...t,
      _id: String(t._id),
      pinned: Boolean(t.pinned),
    }));
    return normalized.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const da = a.lastUsedAt ? new Date(a.lastUsedAt) : new Date(0);
      const db = b.lastUsedAt ? new Date(b.lastUsedAt) : new Date(0);
      return db - da;
    });
  };

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(sortTeams(data)))
      .catch(console.error);
  }, []);

  const formik = useFormik({
    initialValues: {
      date: "",
      teamA: "",
      teamB: "",
      pointsA: "",
      pointsB: "",
      set: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Failed to create game");
        alert("Game Added!");
        resetForm();

        // refresh teams to pick up updated usage/lastUsedAt
        try {
          const refreshed = await fetch("/api/teams").then((r) => r.json());
          setTeams(sortTeams(refreshed));
        } catch (err) {
          console.error("Failed to refresh teams", err);
        }
      } catch (err) {
        console.error(err);
        alert("Error creating game");
      }
    },
  });

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Game</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            className="input input-bordered w-full"
            value={formik.values.date}
            onChange={formik.handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Team A</label>
          <select
            name="teamA"
            className="select select-bordered w-full"
            value={formik.values.teamA}
            onChange={formik.handleChange}
            required
          >
            <option value="">Select Team A</option>
            {teams.filter((t) => t.pinned).length > 0 && (
              <optgroup label="Pinned Teams">
                {teams
                  .filter((t) => t.pinned)
                  .map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
              </optgroup>
            )}
            <optgroup label="Other Teams">
              {teams
                .filter((t) => !t.pinned)
                .map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Team B</label>
          <select
            name="teamB"
            className="select select-bordered w-full"
            value={formik.values.teamB}
            onChange={formik.handleChange}
            required
          >
            <option value="">Select Team B</option>
            {teams.filter((t) => t.pinned).length > 0 && (
              <optgroup label="Pinned Teams">
                {teams
                  .filter((t) => t.pinned)
                  .map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
              </optgroup>
            )}
            <optgroup label="Other Teams">
              {teams
                .filter((t) => !t.pinned)
                .map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Points (Team A)</label>
            <input
              type="number"
              name="pointsA"
              className="input input-bordered w-full"
              min="0"
              value={formik.values.pointsA}
              onChange={formik.handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Points (Team B)</label>
            <input
              type="number"
              name="pointsB"
              className="input input-bordered w-full"
              min="0"
              value={formik.values.pointsB}
              onChange={formik.handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Set</label>
          <input
            type="number"
            name="set"
            className="input input-bordered w-full"
            value={formik.values.set ?? ""}
            onChange={formik.handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Add Game
        </button>
      </form>
    </main>
  );
}
