"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddPlayerForm from "@/app/components/AddPlayerForm";

export default function EditPlayerPage() {
  const { id: playerId } = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [playerRes, teamsRes] = await Promise.all([
        fetch(`/api/players/${playerId}`),
        fetch(`/api/teams`),
      ]);
      const playerData = await playerRes.json();
      const teamData = await teamsRes.json();

      setPlayer(playerData);
      setTeams(teamData);
      setLoading(false);
    }
    fetchData();
  }, [playerId]);

  const handleUpdate = async (values) => {
    await fetch(`/api/players/${playerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    router.push(`/players/${playerId}`); // go back to player detail
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg bg-base-100">
      <h1 className="text-2xl font-bold mb-4">Edit Player</h1>
      <AddPlayerForm
        teams={teams}
        onSubmit={handleUpdate}
        initialValues={{
          name: player.name,
          position: player.position,
          team: player.team?.map((t) => t._id) || [],
        }}
        isEditing
      />
    </div>
  );
}
