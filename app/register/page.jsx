"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
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

      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult.ok) {
        router.push("/");
      } else {
        setError(
          "Registration successful but login failed. Please try logging in."
        );
        setLoading(false);
      }
    } catch (err) {
      setError("Unexpected error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100">
      <div className="max-w-md w-full p-8 bg-base-100 shadow-lg rounded-lg">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Join Volleyball Stat Tracker and start tracking your stats
          </p>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input input-bordered w-full"
              />
              <p className="text-xs text-gray-600 mt-1">
                Use a strong password with at least 8 characters
              </p>
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn btn-primary w-full mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="divider my-4">OR</div>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="link link-primary font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
