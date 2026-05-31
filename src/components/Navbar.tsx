import Link from "next/link";
import Image from "next/image";
import { getServerSupabase, getSessionUser } from "@/lib/supabase/server";
import { fetchProfileById } from "@/lib/supabase/queries";

export async function Navbar() {
  let displayName = "Guest";
  let username: string | null = null;
  let avatarUrl: string | null = null;
  let signedIn = false;

  try {
    const user = await getSessionUser();
    if (user) {
      signedIn = true;
      const supabase = await getServerSupabase();
      const profile = await fetchProfileById(supabase, user.id);
      if (profile) {
        displayName = profile.displayName;
        username = profile.username;
        avatarUrl = profile.avatarUrl;
      }
    }
  } catch {
    // Supabase not configured yet — render guest navbar.
  }

  return (
    <header className="sticky top-0 z-40 bg-[color:var(--background)]/85 backdrop-blur border-b border-[color:var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-[color:var(--primary)] grid place-items-center text-[color:var(--primary-foreground)] font-bold">
            m
          </div>
          <span className="font-bold text-lg tracking-tight">malcale</span>
        </Link>

        <form
          action="/"
          className="flex-1 max-w-2xl hidden sm:block"
          role="search"
        >
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder="Search brands, items, members"
              className="w-full h-10 rounded-full border border-[color:var(--border)] bg-[color:var(--muted)] pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:bg-white"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </div>
        </form>

        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          {signedIn && (
            <>
              <Link
                href="/inbox"
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-[color:var(--muted)]"
                aria-label="Inbox"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </Link>
              <Link
                href="/orders"
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-[color:var(--muted)]"
                aria-label="Orders"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
              </Link>
              {username && avatarUrl && (
                <Link
                  href={`/profile/${username}`}
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-[color:var(--muted)] overflow-hidden"
                  aria-label={`Profile of ${displayName}`}
                >
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="rounded-full"
                    unoptimized
                  />
                </Link>
              )}
              <Link
                href="/listings/new"
                className="ml-1 inline-flex h-10 items-center gap-1.5 rounded-full bg-[color:var(--primary)] px-4 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-90"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
                <span className="hidden sm:inline">Sell now</span>
              </Link>
              <form action="/auth/signout" method="post" className="hidden sm:block">
                <button
                  type="submit"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                </button>
              </form>
            </>
          )}
          {!signedIn && (
            <>
              <Link
                href="/login"
                className="h-10 px-4 inline-flex items-center rounded-full hover:bg-[color:var(--muted)] text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="h-10 px-4 inline-flex items-center rounded-full bg-[color:var(--foreground)] text-[color:var(--background)] text-sm font-semibold hover:opacity-90"
              >
                Sign up
              </Link>
              <Link
                href="/listings/new"
                className="ml-1 hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full bg-[color:var(--primary)] px-4 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-90"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
                Sell now
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
