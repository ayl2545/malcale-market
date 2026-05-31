import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProfileWithListings } from "@/lib/data";
import { getSessionUser } from "@/lib/supabase/server";
import { ListingCard } from "@/components/ListingCard";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const result = await getProfileWithListings(username);
  if (!result) notFound();
  const { user, listings: items } = result;

  let isOwn = false;
  try {
    const session = await getSessionUser();
    isOwn = session?.id === user.id;
  } catch {
    /* not configured yet */
  }

  const active = items.filter((l) => l.status === "active");
  const sold = items.filter((l) => l.status === "sold");

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b">
        <Image
          src={user.avatarUrl}
          alt={user.displayName}
          width={96}
          height={96}
          className="rounded-full"
          unoptimized
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-[color:var(--muted-foreground)]">@{user.username}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-medium text-[color:var(--foreground)]">{user.rating.toFixed(2)}</span>
              <span>({user.reviewCount} reviews)</span>
            </span>
            {user.location && <span>· {user.location}</span>}
            <span>
              · Joined{" "}
              {new Date(user.joinedAt).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          {user.bio && <p className="mt-3 text-sm max-w-prose">{user.bio}</p>}
        </div>
        <div className="flex gap-2">
          {isOwn ? (
            <Link
              href="/settings/payouts"
              className="h-10 px-5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold text-sm hover:opacity-90"
            >
              Payout settings
            </Link>
          ) : (
            <>
              <Link
                href={`/inbox?to=${user.id}`}
                className="h-10 px-5 rounded-full border font-semibold text-sm hover:bg-[color:var(--muted)]"
              >
                Message
              </Link>
              <button
                type="button"
                className="h-10 px-5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold text-sm hover:opacity-90"
              >
                Follow
              </button>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 my-6 text-center">
        <Stat label="Items for sale" value={active.length} />
        <Stat label="Sold" value={sold.length} />
        <Stat label="Reviews" value={user.reviewCount} />
        <Stat
          label="Rating"
          value={user.rating.toFixed(1)}
          className="hidden sm:block"
        />
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Closet ({active.length})</h2>
        {active.length === 0 ? (
          <p className="text-[color:var(--muted-foreground)] text-sm py-8 text-center border rounded-2xl">
            Nothing listed right now.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {active.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={`p-4 rounded-2xl bg-[color:var(--muted)] ${className}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
        {label}
      </div>
    </div>
  );
}
