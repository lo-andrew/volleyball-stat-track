"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topPlayers, setTopPlayers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      return;
    }

    if (status === "authenticated") {
      fetch("/api/top-players")
        .then((res) => res.json())
        .then(setTopPlayers)
        .catch(() => setTopPlayers([]));

      fetch("/api/games")
        .then((res) => res.json())
        .then(setGames)
        .catch(() => setGames([]));
    }
  }, [status]);

  const recentGames = games.filter((g) => {
    const gameDate = new Date(g.date);
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    return gameDate >= sevenDaysAgo && gameDate <= now;
  });

  if (status === "unauthenticated") {
    return (
      <div className="grid grid-cols-12 sm:grid-cols-12 min-h-screen items-center justify-center">
        <div className="col-span-12 md:col-span-6 md:col-start-4">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h1 className="card-title text-4xl font-bold mb-4">
                Volleyball Stat Tracker
              </h1>
              <p className="text-lg mb-8">
                Track and analyze player performance over time.
              </p>

              <p className="text-base mb-6 text-gray-600">
                You must be logged in to view your stats, players, teams, and
                games.
              </p>

              <div className="card-actions gap-4">
                <Link href="/login" className="btn btn-primary btn-lg">
                  Login
                </Link>
                <Link href="/register" className="btn btn-outline btn-lg">
                  Register
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Don't have an account? Click Register to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 sm:grid-cols-12">
        <h1 className="col-span-12 text-3xl font-bold place-self-center mt-10">
          Track your stats!
        </h1>
        <p className="col-span-12 place-self-center mt-5">
          Track and analyze player performance over time.
        </p>
        <p className="col-span-12 place-self-center text-sm text-gray-600 mt-2">
          Welcome, {session?.user?.email}
        </p>

        <div className="col-span-12 place-self-center mt-5 flex flex-wrap gap-3 justify-center">
          <Link href={"/addPlayer"}>
            <button className="btn btn-primary">Add Player</button>
          </Link>
          <Link href={"/addGame"}>
            <button className="btn btn-primary">Add Game</button>
          </Link>
          <Link href={"/addTeam"}>
            <button className="btn btn-primary">Add Team</button>
          </Link>
          <Link href={"/addStats"}>
            <button className="btn btn-primary">Record Stats</button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-15 px-10 justify-evenly">
        <div className="justify-center">
          <h2 className="text-xl font-semibold mb-2">
            Top 3 Players (Hitting %)
          </h2>
          {topPlayers.length > 0 ? (
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
          ) : (
            <p className="text-gray-600">
              No players yet. Add one to get started!
            </p>
          )}
        </div>
        <div className="justify-center">
          <h2 className="text-xl font-semibold mb-2">Recent Games</h2>
          {recentGames.length > 0 ? (
            <ul className="space-y-2">
              {recentGames.map((g) => (
                <li key={g._id}>
                  {new Date(g.date).toLocaleDateString()} —{" "}
                  {g.teamA?.name || "Unknown Team"} vs{" "}
                  {g.teamB?.name || "Unknown Team"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No recent games in the past 7 days.</p>
          )}
        </div>
      </div>
    </>
  );
}
