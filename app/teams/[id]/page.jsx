"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamDetailPage() {
  const { id: teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        if (!res.ok) throw new Error("Failed to fetch team");
        const data = await res.json();
        setTeam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [teamId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-error">Error: {error}</p>;
  if (!team) return <p className="p-6">Team not found.</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-12">
        <h1 className="text-3xl font-bold mb-2 col-span-4">{team.name}</h1>
        <Link
          href={`/teams/${team._id}/edit`}
          className="btn btn-primary col-start-12 col-span-1"
        >
          Edit
        </Link>
      </div>

      {team.description && (
        <p className="mb-6 text-lg text-gray-700">{team.description}</p>
      )}

      <h2 className="text-2xl font-semibold mb-3">Players</h2>

      {team.players?.length > 0 ? (
        <ul className="space-y-2">
          {team.players.map((player) => (
            <li key={player._id} className="text-lg">
              <Link
                href={`/players/${player._id}`}
                className="text-blue-600 hover:underline"
              >
                {player.name}
              </Link>{" "}
              <span className="text-gray-500 text-sm">({player.position})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No players assigned to this team.</p>
      )}
    </main>
  );
}
