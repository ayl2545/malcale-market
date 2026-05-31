"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = getBrowserSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      if (mode === "signup") {
        const cleanUsername = username
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_.]/g, "");
        if (cleanUsername.length < 3) {
          throw new Error("Username must be at least 3 characters.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: cleanUsername, display_name: cleanUsername },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setInfo(
          "Check your email to confirm. After confirming, you'll be logged in.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-3">
      {mode === "signup" && (
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          minLength={3}
          maxLength={30}
          className="w-full h-11 px-4 rounded-lg border bg-white"
        />
      )}
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        className="w-full h-11 px-4 rounded-lg border bg-white"
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        minLength={8}
        className="w-full h-11 px-4 rounded-lg border bg-white"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}
      {info && (
        <p className="text-sm text-[color:var(--primary)] bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/30 rounded-lg p-3">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold disabled:opacity-70 hover:opacity-90"
      >
        {loading ? "…" : mode === "login" ? "Log in" : "Create account"}
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[color:var(--background)] px-2 text-xs text-[color:var(--muted-foreground)]">
            or
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full h-11 rounded-full border font-medium hover:bg-[color:var(--muted)] disabled:opacity-70"
      >
        Continue with Google
      </button>
    </form>
  );
}
