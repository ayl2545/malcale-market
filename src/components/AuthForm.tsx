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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: cleanUsername, display_name: cleanUsername },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) {
          // Email confirmation is off — user is logged in immediately.
          router.push("/");
          router.refresh();
        } else {
          // Confirmation is on — Supabase sent a verification email.
          setInfo(
            "Almost there! Check your email to confirm your account, then log in.",
          );
        }
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
    setInfo(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      const notEnabled =
        /provider is not enabled|unsupported provider|not enabled/i.test(
          error.message,
        );
      setInfo(
        notEnabled
          ? "Google sign-in is coming soon. For now, please use your email and password above."
          : null,
      );
      if (!notEnabled) setError(error.message);
    }
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
        className="w-full h-11 rounded-full border font-medium hover:bg-[color:var(--muted)] disabled:opacity-70 inline-flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
