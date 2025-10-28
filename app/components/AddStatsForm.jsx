"use client";

import { useFormik } from "formik";
import StatButton from "./StatButton";

export default function AddStatsForm({
  games,
  players,
  selectedGame,
  setSelectedGame,
  onSubmit,
}) {
  const formik = useFormik({
    initialValues: {
      player: "",
      game: "",
      kills: { kill: 0, totalAttempt: 0, error: 0 },
      serves: { ace: 0, attempts: 0, error: 0, zero: 0 },
      digStats: { successful: 0, error: 0 },
      blocks: { solo: 0, assist: 0, error: 0, zero: 0 },
      general: { ballError: 0 },
      reception: { attempt: 0, zero: 0, errors: 0 },
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const statLineData = {
          player: values.player,
          game: values.game,
          kills: { ...formik.initialValues.kills, ...values.kills },
          serves: { ...formik.initialValues.serves, ...values.serves },
          digStats: { ...formik.initialValues.digStats, ...values.digStats },
          blocks: { ...formik.initialValues.blocks, ...values.blocks },
          general: { ...formik.initialValues.general, ...values.general },
          reception: { ...formik.initialValues.reception, ...values.reception },
        };

        await onSubmit(statLineData);
        alert("StatLine added!");
        resetForm();
      } catch (err) {
        console.error(err);
        alert(`Error adding statline: ${err.message || err}`);
      }
    },
  });

  return (
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
          className="select select-bordered w-full"
        >
          <option value=""> Select a Game </option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {new Date(game.date).toLocaleDateString()} - {game.teamA.name} vs{" "}
              {game.teamB.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="player">Player Selection</label>
        <select
          id="player"
          name="player"
          value={formik.values.player}
          onChange={formik.handleChange}
          disabled={!selectedGame || players.length === 0}
          className="select select-bordered w-full"
        >
          <option value="">Select a Player</option>

          {selectedGame &&
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

      <h3>Kills</h3>
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(formik.values.kills).map(([field, value]) => (
          <StatButton
            key={`kills-${field}`}
            category="kills"
            field={field}
            value={value}
            setFieldValue={formik.setFieldValue}
          />
        ))}
      </div>

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

      <h3>Digs</h3>
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(formik.values.digStats).map(([field, value]) => (
          <StatButton
            key={field}
            category="digStats"
            field={field}
            value={value}
            setFieldValue={formik.setFieldValue}
          />
        ))}
      </div>

      <h3>General</h3>
      <div className="grid grid-cols-1 gap-6">
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

      <h3>Reception</h3>
      <div className="grid grid-cols-3 gap-6">
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

      <button type="submit" className="btn btn-primary w-full">
        Add StatLine
      </button>
    </form>
  );
}
