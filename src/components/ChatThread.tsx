"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Message } from "@/lib/types";
import { formatPrice, timeAgo } from "@/lib/format";

type Other = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
};

type Listing = {
  id: string;
  title: string;
  price: number;
  image: string;
};

export function ChatThread({
  conversationId,
  initialMessages,
  currentUserId,
  other,
  listing,
}: {
  conversationId: string;
  initialMessages: Message[];
  currentUserId: string;
  other: Other;
  listing: Listing;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      {
        id: `m_${Date.now()}`,
        senderId: currentUserId,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `m_${Date.now() + 1}`,
          senderId: other.id,
          text: "Thanks for the message! I'll get back to you shortly.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-8rem)]">
      <header className="flex items-center gap-3 pb-4 border-b">
        <Link
          href="/inbox"
          className="h-9 w-9 grid place-items-center rounded-full hover:bg-[color:var(--muted)]"
          aria-label="Back"
        >
          ←
        </Link>
        <Link
          href={`/profile/${other.username}`}
          className="flex items-center gap-3 hover:underline"
        >
          <Image
            src={other.avatarUrl}
            alt={other.displayName}
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
          <div>
            <p className="font-semibold">{other.displayName}</p>
            <p className="text-xs text-[color:var(--muted-foreground)]">
              @{other.username}
            </p>
          </div>
        </Link>
      </header>

      <Link
        href={`/listings/${listing.id}`}
        className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-[color:var(--muted)] hover:bg-[color:var(--border)]"
      >
        <Image
          src={listing.image}
          alt={listing.title}
          width={48}
          height={48}
          className="rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{listing.title}</p>
          <p className="text-sm font-bold">{formatPrice(listing.price)}</p>
        </div>
        <Link
          href={`/checkout/${listing.id}`}
          className="h-9 px-4 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-sm font-semibold grid place-items-center hover:opacity-90"
        >
          Buy
        </Link>
      </Link>

      <div
        key={conversationId}
        className="flex-1 overflow-y-auto py-4 space-y-2"
      >
        {messages.map((m, i) => {
          const mine = m.senderId === currentUserId;
          const prevSameAuthor = i > 0 && messages[i - 1].senderId === m.senderId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  mine
                    ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-br-md"
                    : "bg-[color:var(--muted)] rounded-bl-md"
                } ${prevSameAuthor ? "mt-1" : "mt-3"}`}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    mine
                      ? "text-[color:var(--primary-foreground)]/70"
                      : "text-[color:var(--muted-foreground)]"
                  }`}
                >
                  {timeAgo(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="pt-3 border-t flex gap-2 items-end">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(e);
            }
          }}
          placeholder="Write a message…"
          rows={1}
          className="flex-1 px-4 py-3 rounded-full border bg-white resize-none max-h-32"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="h-11 px-5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
