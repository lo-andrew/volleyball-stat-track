import { useEffect, useState } from "react";
import { computeLifetimeStats } from "../../lib/stats";

export default function usePlayer(playerId) {
  const [player, setPlayer] = useState(null);
  const [statlines, setStatlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [pRes, sRes] = await Promise.all([
          fetch(`/api/players/${playerId}`),
          fetch(`/api/players/${playerId}/statlines`),
        ]);
        if (!pRes.ok || !sRes.ok) throw new Error("Fetch failed");
        const playerData = await pRes.json();
        const statData = await sRes.json();

        if (!mounted) return;
        setPlayer(playerData);
        setStatlines(statData || []);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [playerId]);

  const lifetimeStats = computeLifetimeStats(statlines);

  return { player, statlines, lifetimeStats, loading, error };
}
