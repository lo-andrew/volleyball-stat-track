"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then(setGames);
  }, []);

  return (
    <div className="grid grid-cols-12">
      <h1 className="text-4xl font-bold col-span-12 col-start-6 mb-5">Games</h1>
      <ul className="col-span-12 col-start-5">
        {games
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((g) => (
            <Link
              key={g._id}
              href={`/games/${g._id}`}
              className="text-blue-600 hover:underline"
            >
              <li key={g._id}>
                {new Date(g.date).toLocaleDateString()} —{" "}
                {g.teamA?.name || "Unknown Team"} vs{" "}
                {g.teamB?.name || "Unknown Team"}
                Set: {g.set ? g.set : ""}
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
}
