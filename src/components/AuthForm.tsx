"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => router.push("/"), 700);
      }}
      className="mt-8 space-y-3"
    >
      {mode === "signup" && (
        <input
          required
          placeholder="Username"
          className="w-full h-11 px-4 rounded-lg border bg-white"
        />
      )}
      <input
        required
        type="email"
        placeholder="Email"
        className="w-full h-11 px-4 rounded-lg border bg-white"
      />
      <input
        required
        type="password"
        placeholder="Password"
        minLength={8}
        className="w-full h-11 px-4 rounded-lg border bg-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold disabled:opacity-70 hover:opacity-90"
      >
        {loading ? "…" : mode === "login" ? "Log in" : "Create account"}
      </button>
      <div className="text-center text-xs text-[color:var(--muted-foreground)] pt-2">
        Demo: any credentials work. No data is stored.
      </div>
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
        className="w-full h-11 rounded-full border font-medium hover:bg-[color:var(--muted)]"
      >
        Continue with Google
      </button>
      <button
        type="button"
        className="w-full h-11 rounded-full border font-medium hover:bg-[color:var(--muted)]"
      >
        Continue with Apple
      </button>
    </form>
  );
}
