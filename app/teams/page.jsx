"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// small helper to call PATCH and return JSON
async function patchJSON(url, body) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data || []).map((t) => ({
          ...t,
          _id: String(t._id),
          pinned: Boolean(t.pinned),
        }));

        normalized.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          const da = a.lastUsedAt ? new Date(a.lastUsedAt) : new Date(0);
          const db = b.lastUsedAt ? new Date(b.lastUsedAt) : new Date(0);
          return db - da;
        });

        setTeams(normalized);
      })
      .catch(console.error);
  }, []);

  const togglePin = async (team) => {
    try {
      setTeams((prev) => {
        const next = prev.map((t) =>
          t._id === team._id ? { ...t, pinned: !t.pinned } : t
        );
        return [...next].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          const da = a.lastUsedAt ? new Date(a.lastUsedAt) : new Date(0);
          const db = b.lastUsedAt ? new Date(b.lastUsedAt) : new Date(0);
          return db - da;
        });
      });

      const updated = await patchJSON(`/api/teams/${team._id}`, {
        pinned: !team.pinned,
      });
      console.debug("togglePin response:", updated);

      if (typeof updated.pinned !== "boolean") {
        fetch("/api/teams")
          .then((res) => res.json())
          .then((data) => {
            const normalized = (data || []).map((t) => ({
              ...t,
              _id: String(t._id),
              pinned: Boolean(t.pinned),
            }));
            normalized.sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              const da = a.lastUsedAt ? new Date(a.lastUsedAt) : new Date(0);
              const db = b.lastUsedAt ? new Date(b.lastUsedAt) : new Date(0);
              return db - da;
            });
            setTeams(normalized);
          })
          .catch((e) =>
            console.error("Failed to refresh teams after toggle", e)
          );
        return;
      }

      const norm = {
        ...updated,
        _id: String(updated._id),
        pinned: Boolean(updated.pinned),
      };
      setTeams((prev) => {
        const next = prev.map((t) => (t._id === norm._id ? norm : t));
        return [...next].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          const da = a.lastUsedAt ? new Date(a.lastUsedAt) : new Date(0);
          const db = b.lastUsedAt ? new Date(b.lastUsedAt) : new Date(0);
          return db - da;
        });
      });
    } catch (err) {
      console.error(err);
      alert("Failed to toggle pin");
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Link href="/addTeam" className="btn btn-primary">
          Add Team
        </Link>
      </div>

      <div className="space-y-4">
        {teams.map((t) => (
          <div
            key={t._id}
            className="flex items-center justify-between p-3 border rounded"
          >
            <div>
              <Link
                href={`/teams/${t._id}`}
                className="text-lg font-medium text-blue-600 hover:underline"
              >
                {t.name}
              </Link>
              <div className="text-sm text-gray-600">
                {t.description || "No description"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t.players?.length || 0} players • Last used:{" "}
                {t.lastUsedAt
                  ? new Date(t.lastUsedAt).toLocaleString()
                  : "Never"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {t.pinned && <div className="badge badge-warning">Pinned</div>}
              <button
                className={`btn btn-sm ${
                  t.pinned ? "btn-outline" : "btn-ghost"
                }`}
                onClick={() => togglePin(t)}
              >
                {t.pinned ? "Unpin" : "Pin"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
