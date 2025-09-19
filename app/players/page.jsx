"use client";
import { useEffect, useState } from "react";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then(setPlayers);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Players</h1>
      <ul>
        {players.map((p) => (
          <li key={p._id}>
            {p.name} – {p.position} ({p.team?.name || "No team"})
          </li>
        ))}
      </ul>
    </main>
  );
}
