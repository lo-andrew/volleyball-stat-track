import { useEffect, useState } from "react";

export default function useAddStats() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all games on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/games");
        const data = await res.json();
        if (!mounted) return;
        setGames(data || []);
      } catch (err) {
        console.error("Error fetching games", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // When a game is selected, fetch players for both teams
  useEffect(() => {
    if (!selectedGame) {
      setPlayers([]);
      return;
    }

    let mounted = true;
    const fetchPlayersForGame = async () => {
      try {
        const gameData = games.find((g) => g._id === selectedGame);
        if (!gameData) return;

        const [teamAPlayers, teamBPlayers] = await Promise.all([
          fetch(`/api/teams/${gameData.teamA._id}/players`).then((r) =>
            r.json()
          ),
          fetch(`/api/teams/${gameData.teamB._id}/players`).then((r) =>
            r.json()
          ),
        ]);

        const teamAPlayersWithTeam = teamAPlayers.map((p) => ({
          ...p,
          team: { _id: gameData.teamA._id, name: gameData.teamA.name },
        }));

        const teamBPlayersWithTeam = teamBPlayers.map((p) => ({
          ...p,
          team: { _id: gameData.teamB._id, name: gameData.teamB.name },
        }));

        const combinedPlayers = [
          ...teamAPlayersWithTeam,
          ...teamBPlayersWithTeam,
        ].filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (p) => p._id === value._id && p.team._id === value.team._id
            )
        );

        if (!mounted) return;
        setPlayers(combinedPlayers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayersForGame();

    return () => {
      mounted = false;
    };
  }, [selectedGame, games]);

  async function submitStatLine(statLineData) {
    try {
      const res = await fetch("/api/statlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statLineData),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(err.message || "Failed to create statline");
      }

      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  return {
    games,
    players,
    selectedGame,
    setSelectedGame,
    loading,
    submitStatLine,
  };
}
