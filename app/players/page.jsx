"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then(setPlayers);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Players</h1>
      <ul className="space-y-2">
        {players.map((p) => (
          <li key={p._id} className="flex items-center gap-2">
            <Link
              href={`/players/${p._id}`}
              className="text-blue-600 hover:underline"
            >
              {p.name}
            </Link>
            <span className="text-gray-600">
              — {p.team?.map((t) => t.name).join(", ") || "No team"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
