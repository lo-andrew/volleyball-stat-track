"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PlayerDetailPage() {
  const { id } = useParams(); // gets the dynamic ID from the URL
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // wait until id is available
    fetch(`/api/players/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayer(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching player:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!player) return <p className="p-6">Player not found.</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">{player.name}</h1>
      <p className="mb-1">
        <strong>Position:</strong> {player.position}
      </p>
      <p className="mb-1">
        <strong>Teams:</strong>{" "}
        {player.team?.map((t) => t.name).join(", ") || "No team assigned"}
      </p>
    </main>
  );
}
