"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setError("Unexpected error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg bg-base-100">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <h1 className="text-2xl font-bold">Create an Account</h1>

        <form
          className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4"
          onSubmit={handleRegister}
        >
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <div>
            <button
              className="btn btn-primary w-full mt-2 col-start-2 col-span-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
