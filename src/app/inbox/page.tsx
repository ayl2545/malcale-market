import Image from "next/image";
import Link from "next/link";
import {
  conversations,
  getUser,
  getListing,
  CURRENT_USER_ID,
} from "@/lib/mock-data";
import { timeAgo, formatPrice } from "@/lib/format";

export default function InboxPage() {
  const sorted = conversations.slice().sort((a, b) => {
    const lastA = a.messages[a.messages.length - 1]?.createdAt ?? "";
    const lastB = b.messages[b.messages.length - 1]?.createdAt ?? "";
    return lastB.localeCompare(lastA);
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">Inbox</h1>
      <p className="mt-1 text-[color:var(--muted-foreground)]">
        Messages with buyers and sellers.
      </p>

      <div className="mt-6 divide-y border rounded-2xl bg-[color:var(--card)]">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-[color:var(--muted-foreground)]">
            No messages yet.
          </div>
        ) : (
          sorted.map((c) => {
            const other = getUser(c.participantId);
            const listing = getListing(c.listingId);
            const last = c.messages[c.messages.length - 1];
            const lastIsMe = last?.senderId === CURRENT_USER_ID;
            if (!other || !listing || !last) return null;
            return (
              <Link
                key={c.id}
                href={`/inbox/${c.id}`}
                className="flex items-center gap-3 p-4 hover:bg-[color:var(--muted)]"
              >
                <div className="relative">
                  <Image
                    src={other.avatarUrl}
                    alt={other.displayName}
                    width={48}
                    height={48}
                    className="rounded-full"
                    unoptimized
                  />
                  {c.unread && (
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[color:var(--primary)] border-2 border-[color:var(--background)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`truncate ${c.unread ? "font-bold" : "font-medium"}`}>
                      {other.displayName}
                    </p>
                    <span className="text-xs text-[color:var(--muted-foreground)] shrink-0">
                      {timeAgo(last.createdAt)}
                    </span>
                  </div>
                  <p className={`truncate text-sm ${c.unread ? "text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)]"}`}>
                    {lastIsMe && "You: "}{last.text}
                  </p>
                </div>
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover shrink-0 hidden sm:block"
                />
                <div className="hidden sm:block text-right shrink-0">
                  <p className="font-semibold text-sm">{formatPrice(listing.price)}</p>
                  <p className="text-xs text-[color:var(--muted-foreground)] truncate max-w-[120px]">
                    {listing.title}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
