"use client";

import { signIn } from "next-auth/react";
import { Router, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100">
      <div className="max-w-md w-full p-8 bg-base-100 shadow-lg rounded-lg">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your Volleyball Stat Tracker account
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
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
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <button className="btn btn-primary w-full mt-4" type="submit">
              Login
            </button>
          </form>

          <div className="divider my-4">OR</div>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="link link-primary font-semibold">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
