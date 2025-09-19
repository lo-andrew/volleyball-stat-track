"use client";
import { useEffect, useState } from "react";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then(setTeams);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Teams</h1>
      <ul>
        {teams.map((t) => (
          <li key={t._id}>
            {t.name} – {t.description || "No description"}
          </li>
        ))}
      </ul>
    </main>
  );
}
