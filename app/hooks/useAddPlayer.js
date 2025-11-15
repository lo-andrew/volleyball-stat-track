import { useState, useEffect } from "react";

export default function useAddPlayer() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log("Fetching teams...");
        const res = await fetch("/api/teams", {
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Server error response:", errorData);
          throw new Error(
            errorData.error || `Failed to fetch teams: ${res.status}`
          );
        }

        const text = await res.text();
        console.log("Raw response:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error("JSON Parse error:", parseErr);
          throw new Error("Invalid JSON response from server");
        }

        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          throw new Error("Invalid data format from server");
        }

        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError(err.message || "Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const createPlayer = async (playerData) => {
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(playerData),
      });

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (parseErr) {
          console.error("Failed to parse error response:", parseErr);
          errorData = {
            error: `Server error: ${res.status} ${res.statusText}`,
          };
        }
        throw new Error(errorData.error || "Failed to create player");
      }

      return await res.json();
    } catch (err) {
      console.error("Error creating player:", err);
      throw err;
    }
  };

  return { teams, loading, error, createPlayer };
}
