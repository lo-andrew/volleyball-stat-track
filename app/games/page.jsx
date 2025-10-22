"use client";

import { useEffect, useState } from "react";

export default function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then(setGames);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold">Games</h1>
      <ul>
        {games.map((g) => (
          <li key={g._id}>
            {new Date(g.date).toLocaleDateString()} —{" "}
            {g.teamA?.name || "Unknown Team"} vs{" "}
            {g.teamB?.name || "Unknown Team"}
          </li>
        ))}
      </ul>
    </>
  );
}
