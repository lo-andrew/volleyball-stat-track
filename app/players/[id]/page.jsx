"use client";

import { useParams } from "next/navigation";
import usePlayer from "../../hooks/usePlayer";
import LifetimeStats from "../../components/LifetimeStats";
import GameStats from "../../components/GameStats";

export default function PlayerDetailPage() {
  const { id: playerId } = useParams();
  const { player, statlines, lifetimeStats, loading, error } =
    usePlayer(playerId);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6">Error loading player.</p>;
  if (!player) return <p className="p-6">Player not found.</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{player.name}</h1>
      <p className="mb-1">
        <strong>Position:</strong> {player.position}
      </p>
      <p className="mb-4">
        <strong>Teams:</strong>{" "}
        {player.team?.map((t) => t.name).join(", ") || "No team assigned"}
      </p>

      <h2 className="text-xl font-semibold mb-2">Lifetime Stats</h2>
      <LifetimeStats lifetimeStats={lifetimeStats} />

      <h2 className="text-xl font-semibold mb-2">Game Stats</h2>
      <GameStats statlines={statlines} />
    </main>
  );
}
