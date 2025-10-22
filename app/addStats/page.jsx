"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import StatButton from "@/components/StatButton";

export default function AddStatLinePage() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");

  // Fetch all games
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch(console.error);
  }, []);

  // When a game is selected, fetch its teams and then their players
  useEffect(() => {
    if (!selectedGame) return;

    const fetchPlayersForGame = async () => {
      try {
        // find the selected game object
        const gameData = games.find((g) => g._id === selectedGame);
        if (!gameData) return;

        const [teamAPlayers, teamBPlayers] = await Promise.all([
          fetch(`/api/teams/${gameData.teamA._id}/players`).then((res) =>
            res.json()
          ),
          fetch(`/api/teams/${gameData.teamB._id}/players`).then((res) =>
            res.json()
          ),
        ]);

        // Attach the team info manually
        const teamAPlayersWithTeam = teamAPlayers.map((p) => ({
          ...p,
          team: { _id: gameData.teamA._id, name: gameData.teamA.name },
        }));

        const teamBPlayersWithTeam = teamBPlayers.map((p) => ({
          ...p,
          team: { _id: gameData.teamB._id, name: gameData.teamB.name },
        }));

        // Combine and deduplicate
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

        setPlayers(combinedPlayers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayersForGame();
  }, [selectedGame, games]);

  const formik = useFormik({
    initialValues: {
      player: "",
      game: "",
      kills: { kill: 0, totalAttempt: 0, error: 0 },
      serves: { ace: 0, attempts: 0, error: 0, zero: 0 },
      digs: 0,
      blocks: { solo: 0, assist: 0, error: 0, zero: 0 },
      general: { ballError: 0, setsPlayed: 0 },
      reception: { errors: 0, attempt: 0 },
    },
    onSubmit: async (values, { resetForm }) => {
      const res = await fetch("/api/statlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        alert("StatLine added!");
        resetForm();
      } else {
        alert("Error adding statline");
      }
    },
  });

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Player StatLine</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="game">Select Game</label>
          <select
            id="game"
            name="game"
            value={formik.values.game}
            onChange={(e) => {
              formik.handleChange(e);
              setSelectedGame(e.target.value);
            }}
          >
            <option value=""> Select a Game </option>
            {games.map((game) => (
              <option key={game._id} value={game._id}>
                {new Date(game.date).toLocaleDateString()} - {game.teamA.name}{" "}
                vs {game.teamB.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Player */}
        <div>
          <label htmlFor="player">Select Player</label>
          <select
            id="player"
            name="player"
            value={formik.values.player}
            onChange={formik.handleChange}
            disabled={!selectedGame || players.length === 0}
          >
            <option value="">-- Select a Player --</option>

            {selectedGame &&
              // get players for each team separately
              ["teamA", "teamB"].map((teamKey) => {
                const teamPlayers = players.filter(
                  (p) =>
                    p.team._id ===
                    games.find((g) => g._id === selectedGame)[teamKey]._id
                );
                if (teamPlayers.length === 0) return null;

                return (
                  <optgroup
                    key={teamKey}
                    label={
                      games.find((g) => g._id === selectedGame)[teamKey].name
                    }
                  >
                    {teamPlayers.map((player) => (
                      <option
                        key={`${player._id}-${player.team._id}`}
                        value={player._id}
                      >
                        {player.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
          </select>
        </div>

        {/* Stat boxes */}
        <h3>Kills</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* kills */}

          {Object.entries(formik.values.kills).map(([field, value]) => (
            <StatButton
              key={field}
              category="kills"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}
        </div>

        {/* serves */}
        <h3>Serves</h3>
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(formik.values.serves).map(([field, value]) => (
            <StatButton
              key={field}
              category="serves"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}
        </div>

        {/* blocks */}
        <h3>Blocks</h3>
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(formik.values.blocks).map(([field, value]) => (
            <StatButton
              key={field}
              category="blocks"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}
        </div>

        {/* digs */}
        <h3>Digs</h3>
        <StatButton
          category="digs"
          field="digs"
          value={formik.values.digs}
          setFieldValue={formik.setFieldValue}
        />

        {/* general */}
        <h3>General</h3>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(formik.values.general).map(([field, value]) => (
            <StatButton
              key={field}
              category="general"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}
        </div>

        {/* reception */}
        <h3>Reception</h3>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(formik.values.reception).map(([field, value]) => (
            <StatButton
              key={field}
              category="reception"
              field={field}
              value={value}
              setFieldValue={formik.setFieldValue}
            />
          ))}
        </div>

        {/* Repeat for other stats */}

        {/* Repeat similarly for serves, blocks, reception, general */}
        {/* You can group them visually with <fieldset> if needed */}

        <button type="submit" className="btn btn-primary w-full">
          Add StatLine
        </button>
      </form>
    </main>
  );
}
