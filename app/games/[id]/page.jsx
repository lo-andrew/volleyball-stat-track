"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GameDetailPage() {
  const { id } = useParams(); // Get the dynamic route param
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // wait until the param is available

    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${id}`);
        if (!res.ok) throw new Error("Failed to fetch game");
        const data = await res.json();
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) return <p className="p-4">Loading game details...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!game) return <p className="p-4">Game not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Game Details</h1>

      <div className="border rounded-lg p-4 shadow">
        <p>
          <strong>Date:</strong> {new Date(game.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Set:</strong> {game.set ? game.set : ""}
        </p>

        <p>
          <strong>Team A:</strong> {game.teamA?.name || "Unknown"}
          points: {game.pointsA}
        </p>
        <p>
          <strong>Team B:</strong> {game.teamB?.name || "Unknown"}
          points: {game.pointsB}
        </p>
      </div>
    </div>
  );
}
