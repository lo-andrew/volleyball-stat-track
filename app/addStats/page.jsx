"use client";

import AddStatsForm from "../components/AddStatsForm";
import useAddStats from "../hooks/useAddStats";

export default function AddStatLinePage() {
  const {
    games,
    players,
    selectedGame,
    setSelectedGame,
    loading,
    submitStatLine,
  } = useAddStats();

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Player StatLine</h1>
      <AddStatsForm
        games={games}
        players={players}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        onSubmit={submitStatLine}
      />
    </main>
  );
}
