"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";

export default function AddTeamPage() {
  const [players, setPlayers] = useState([]);

  // Fetch all players for multi-select
  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch(console.error);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Failed to create team");
        alert("Team created!");
        formik.resetForm();
      } catch (err) {
        console.error(err);
        alert("Error creating team");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg bg-base-100">
      <h1 className="text-2xl font-bold mb-4">Add New Team</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Team Name
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="textarea textarea-bordered w-full"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">
          Create Team
        </button>
      </form>
    </div>
  );
}
