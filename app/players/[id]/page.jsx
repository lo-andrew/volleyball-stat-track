"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PlayerDetailPage() {
  const { id: playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [statlines, setStatlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lifetimeStats, setLifetimeStats] = useState({
    kills: { kill: 0, totalAttempt: 0, error: 0 },
    serves: { ace: 0, attempts: 0, error: 0, zero: 0 },
    digs: { digs: 0, error: 0 },
    blocks: { solo: 0, assist: 0, error: 0, zero: 0 },
    general: { ballError: 0, setsPlayed: 0 },
    reception: { errors: 0, attempt: 0, zero: 0 },
  });

  useEffect(() => {
    if (!playerId) return;

    const fetchPlayerAndStats = async () => {
      try {
        // Fetch player info
        const playerRes = await fetch(`/api/players/${playerId}`);
        const playerData = await playerRes.json();
        setPlayer(playerData);

        // Fetch statlines
        const statRes = await fetch(`/api/players/${playerId}/statlines`);
        const statData = await statRes.json();
        setStatlines(statData);

        // Compute lifetime stats by aggregating all fields
        const totals = statData.reduce(
          (acc, s) => {
            // Kills
            acc.kills.kill += s.kills?.kill || 0;
            acc.kills.totalAttempt += s.kills?.totalAttempt || 0;
            acc.kills.error += s.kills?.error || 0;

            // Serves
            acc.serves.ace += s.serves?.ace || 0;
            acc.serves.attempts += s.serves?.attempts || 0;
            acc.serves.error += s.serves?.error || 0;
            acc.serves.zero += s.serves?.zero || 0;

            // Digs
            acc.digs.digs += s.digs?.digs || 0;
            acc.digs.error += s.digs?.error || 0;

            // Blocks
            acc.blocks.solo += s.blocks?.solo || 0;
            acc.blocks.assist += s.blocks?.assist || 0;
            acc.blocks.error += s.blocks?.error || 0;
            acc.blocks.zero += s.blocks?.zero || 0;

            // General
            acc.general.ballError += s.general?.ballError || 0;
            acc.general.setsPlayed += s.general?.setsPlayed || 0;

            // Reception
            acc.reception.errors += s.reception?.errors || 0;
            acc.reception.attempt += s.reception?.attempt || 0;
            acc.reception.zero += s.reception?.zero || 0;

            return acc;
          },
          {
            kills: { kill: 0, totalAttempt: 0, error: 0 },
            serves: { ace: 0, attempts: 0, error: 0, zero: 0 },
            digs: { digs: 0, error: 0 },
            blocks: { solo: 0, assist: 0, error: 0, zero: 0 },
            general: { ballError: 0, setsPlayed: 0 },
            reception: { errors: 0, attempt: 0, zero: 0 },
          }
        );

        setLifetimeStats(totals);
      } catch (err) {
        console.error("Error fetching player or stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerAndStats();
  }, [playerId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!player) return <p className="p-6">Player not found.</p>;

  const hittingPercentage =
    lifetimeStats.kills.totalAttempt > 0
      ? ((lifetimeStats.kills.kill - lifetimeStats.kills.error) /
          lifetimeStats.kills.totalAttempt) *
        100
      : 0;

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

      {/* Lifetime Stats */}
      <h2 className="text-xl font-semibold mb-2">Lifetime Stats</h2>
      <div className="overflow-x-auto mb-6">
        <table className="table table-compact table-zebra w-full">
          <thead>
            <tr>
              <th>Category</th>
              <th>Details / Totals</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kills</td>
              <td>
                {lifetimeStats.kills.kill} / {lifetimeStats.kills.totalAttempt}{" "}
                (errors: {lifetimeStats.kills.error})
              </td>
            </tr>
            <tr>
              <td>Hitting %</td>
              <td>{hittingPercentage.toFixed(2)}%</td>
            </tr>
            <tr>
              <td>Serves</td>
              <td>
                ace: {lifetimeStats.serves.ace} / attempts{" "}
                {lifetimeStats.serves.attempts} (errors:{" "}
                {lifetimeStats.serves.error}, zeros: {lifetimeStats.serves.zero}
                )
              </td>
            </tr>
            <tr>
              <td>Digs</td>
              <td>
                {lifetimeStats.digs.digs} (errors: {lifetimeStats.digs.error})
              </td>
            </tr>
            <tr>
              <td>Blocks</td>
              <td>
                solo: {lifetimeStats.blocks.solo}, assist:{" "}
                {lifetimeStats.blocks.assist} (errors:{" "}
                {lifetimeStats.blocks.error}, zeros: {lifetimeStats.blocks.zero}
                )
              </td>
            </tr>
            <tr>
              <td>Reception</td>
              <td>
                errors: {lifetimeStats.reception.errors}, attempts:{" "}
                {lifetimeStats.reception.attempt}, zeros:{" "}
                {lifetimeStats.reception.zero}
              </td>
            </tr>
            <tr>
              <td>General</td>
              <td>
                ballError: {lifetimeStats.general.ballError}, setsPlayed:{" "}
                {lifetimeStats.general.setsPlayed}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Game Stats Table remains unchanged */}
      <h2 className="text-xl font-semibold mb-2">Game Stats</h2>
      <div className="overflow-x-auto">
        <table className="table table-compact table-zebra w-full">
          <thead>
            <tr>
              <th>Game</th>
              <th>Kills</th>
              <th>Serves</th>
              <th>Digs</th>
              <th>Blocks</th>
              <th>Reception</th>
              <th>General</th>
            </tr>
          </thead>
          <tbody>
            {statlines.map((s) => (
              <tr key={s._id}>
                <td>
                  {s.game
                    ? new Date(s.game.date).toLocaleDateString()
                    : "Unknown"}{" "}
                  - {s.game?.teamA?.name || "?"} vs {s.game?.teamB?.name || "?"}
                </td>
                <td>
                  {s.kills.kill} / {s.kills.totalAttempt} (errors:{" "}
                  {s.kills.error})
                </td>
                <td>
                  ace: {s.serves.ace} / {s.serves.attempts} (errors:{" "}
                  {s.serves.error}, zeros: {s.serves.zero})
                </td>
                <td>{s.digs.digs}</td>
                <td>
                  solo: {s.blocks.solo} assist: {s.blocks.assist} (errors:{" "}
                  {s.blocks.error}, zeros: {s.blocks.zero})
                </td>
                <td>
                  errors: {s.reception.errors}, attempts: {s.reception.attempt}
                </td>
                <td>
                  ballError: {s.general.ballError}, setsPlayed:{" "}
                  {s.general.setsPlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
