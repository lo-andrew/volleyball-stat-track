"use client";

import { useState } from "react";
import useAddPlayer from "../hooks/useAddPlayer";
import AddPlayerForm from "../components/AddPlayerForm";

export default function AddPlayerPage() {
  const { teams, loading, error: fetchError, createPlayer } = useAddPlayer();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      await createPlayer(values);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (fetchError) return <div className="p-4 text-error">{fetchError}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg bg-base-100">
      <h1 className="text-2xl font-bold mb-4">Add New Player</h1>

      {submitSuccess && (
        <div className="alert alert-success mb-4">
          Player created successfully!
        </div>
      )}

      {submitError && (
        <div className="alert alert-error mb-4">{submitError}</div>
      )}

      <AddPlayerForm teams={teams} onSubmit={handleSubmit} />
    </div>
  );
}
