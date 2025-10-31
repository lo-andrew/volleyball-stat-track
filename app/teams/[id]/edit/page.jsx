"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTeamPage() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const [tRes, pRes] = await Promise.all([
          fetch(`/api/teams/${id}`),
          fetch(`/api/players`),
        ]);

        if (!tRes.ok) throw new Error("Failed to load team");
        if (!pRes.ok) throw new Error("Failed to load players");

        const tData = await tRes.json();
        const pData = await pRes.json();
        if (!mounted) return;
        setTeam(tData);
        setAllPlayers(pData || []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError(err.message || "Error loading data");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-error">{error}</p>;
  if (!team) return <p className="p-6">Team not found.</p>;

  const togglePlayer = (playerId) => {
    const current =
      team.players?.map((p) => (typeof p === "string" ? p : p._id)) || [];
    const idx = current.indexOf(playerId);
    let next;
    if (idx === -1) next = [...current, playerId];
    else next = current.filter((p) => p !== playerId);
    setTeam({ ...team, players: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const body = {
        name: team.name,
        description: team.description,
        players: (team.players || []).map((p) =>
          typeof p === "string" ? p : p._id
        ),
      };

      const res = await fetch(`/api/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save team");
      }

      // navigate back to team page
      router.push(`/teams/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error saving team");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Team</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            className="input input-bordered w-full"
            value={team.name || ""}
            onChange={(e) => setTeam({ ...team, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={team.description || ""}
            onChange={(e) => setTeam({ ...team, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Players</label>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto p-2 border rounded">
            {/* Only show players that currently list this team in their team array */}
            {allPlayers
              .filter((p) => {
                const teamIds = (p.team || [])
                  .map((t) => (typeof t === "string" ? t : t._id))
                  .map(String);
                return teamIds.includes(String(id));
              })
              .map((p) => {
                const assigned = (team.players || [])
                  .map((x) => String(typeof x === "string" ? x : x._id))
                  .includes(String(p._id));
                return (
                  <label key={p._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={assigned}
                      onChange={() => togglePlayer(String(p._id))}
                      className="checkbox checkbox-sm"
                    />
                    <span>
                      {p.name}{" "}
                      <small className="text-gray-500">({p.position})</small>
                    </span>
                  </label>
                );
              })}
          </div>
        </div>

        {error && <div className="text-error">{error}</div>}

        <div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Team"}
          </button>
        </div>
      </form>
    </main>
  );
}
