"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/worker";
  const registered = searchParams.get("registered") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
      router.refresh();
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm card">
        <h1 className="mb-2 text-xl font-semibold text-white">
          Log in
        </h1>
        <p className="mb-6 text-sm text-gray-400">
          Worker or admin — use your account to continue.
        </p>
        {registered && (
          <p className="mb-4 rounded-lg bg-emerald-500/20 p-2 text-sm text-emerald-400">
            Account created. You can log in now.
          </p>
        )}
        {searchParams.get("admin") === "1" && (
          <p className="mb-4 rounded-lg bg-emerald-500/20 p-2 text-sm text-emerald-400">
            Admin account created. You can log in now.
          </p>
        )}
        {searchParams.get("worker") === "1" && (
          <p className="mb-4 rounded-lg bg-amber-500/20 p-2 text-sm text-amber-400">
            Workers cannot sign up. Ask your admin for an account, then log in here.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Workers: use the email and password your admin gave you. No sign up — only the admin can create accounts.
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
