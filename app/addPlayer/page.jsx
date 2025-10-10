"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";

export default function AddPlayerPage() {
  const [teams, setTeams] = useState([]);

  // Fetch teams from API
  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch(console.error);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      position: "",
      team: [], // array of team IDs
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch("/api/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Failed to create player");
        alert("Player created!");
        formik.resetForm();
      } catch (err) {
        console.error(err);
        alert("Error creating player");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg bg-base-100">
      <h1 className="text-2xl font-bold mb-4">Add New Player</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="input input-bordered w-full"
            onChange={formik.handleChange}
            value={formik.values.name}
            required
          />
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block font-medium mb-1">
            Position
          </label>
          <select
            id="position"
            name="position"
            className="select select-bordered w-full"
            onChange={formik.handleChange}
            value={formik.values.position}
            required
          >
            <option value="" disabled>
              Select position
            </option>
            <option value="setter">Setter</option>
            <option value="libero">Libero</option>
            <option value="outside">Outside</option>
            <option value="middle">Middle</option>
            <option value="opposite">Opposite</option>
          </select>
        </div>

        {/* Teams */}
        <div>
          <label className="block font-medium mb-1">Team(s)</label>
          <div className="space-y-2">
            {teams.map((t) => (
              <label key={t._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="team"
                  value={t._id}
                  checked={formik.values.team.includes(t._id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const selectedTeams = formik.values.team.includes(value)
                      ? formik.values.team.filter((id) => id !== value)
                      : [...formik.values.team, value];
                    formik.setFieldValue("team", selectedTeams);
                  }}
                  className="checkbox checkbox-primary"
                />
                <span>{t.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Create Player
        </button>
      </form>
    </div>
  );
}
