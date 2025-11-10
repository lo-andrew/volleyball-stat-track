"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [topPlayers, setTopPlayers] = useState([]);

  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("/api/top-players")
      .then((res) => res.json())
      .then(setTopPlayers);
    fetch("/api/games")
      .then((res) => res.json())
      .then(setGames);
  }, []);

  const recentGames = games.filter((g) => {
    const gameDate = new Date(g.date);
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    return gameDate >= sevenDaysAgo && gameDate <= now;
  });

  return (
    <>
      <div className="grid grid-cols-12 sm:grid-cols-12">
        <h1 className="col-span-12 text-3xl font-bold place-self-center mt-10">
          Track your stats!
        </h1>
        <p className="col-span-12 place-self-center mt-5">
          Track and analyze player performance over time.
        </p>
        <h2>
          Currently, only reading is available to prevent until maintenance is
          complete
        </h2>
        <div className="col-span-12 place-self-center mt-5">
          <Link className="mr-5" href={"/addPlayer"}>
            <button className="btn btn-primary">Add Player</button>
          </Link>
          <Link className="" href={"/addGame"}>
            <button className="btn btn-primary">Add Game</button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-15 px-10">
        <div className="justify-center">
          <h2 className="text-xl font-semibold mb-2">
            Top 3 Players (Hitting %)
          </h2>
          <ul className="space-y-2">
            {topPlayers.map((p) => (
              <li key={p._id} className="flex flex-row gap-4 items-center">
                <Link
                  href={`/players/${p._id}`}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {p.name}
                </Link>
                <span>
                  {p.stats.kills} kills / {p.stats.totalAttempt} attempts
                  (errors: {p.stats.error}) &nbsp;|&nbsp; Hitting %:{" "}
                  {p.stats.hittingPercentage.toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="justify-center">
          <h2 className="text-xl font-semibold mb-2">Games</h2>
          <ul className="space-y-2">
            {recentGames.length > 0 ? (
              recentGames.map((g) => (
                <li key={g._id}>
                  {new Date(g.date).toLocaleDateString()} —{" "}
                  {g.teamA?.name || "Unknown Team"} vs{" "}
                  {g.teamB?.name || "Unknown Team"}
                </li>
              ))
            ) : (
              <p>No recent games in the past 7 days.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
