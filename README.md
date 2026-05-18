# malcale

A Vinted-style marketplace UI for buying and selling pre-loved fashion. **Frontend prototype with mock data — no real backend, no real transactions.**

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## Pages

- **`/`** — Home feed with category, condition, price-range filters and sort
- **`/listings/[id]`** — Listing detail with image gallery, seller card, buy/message CTAs
- **`/listings/new`** — Create-a-listing form with live seller-payout calculation
- **`/profile/[username]`** — Seller profile with rating, stats, and closet
- **`/inbox`** + `/inbox/[id]` — Conversations list and 1:1 chat with mock auto-replies
- **`/checkout/[id]`** — Multi-step checkout: address → payment → confirmation
- **`/orders`** — Buyer order dashboard with status badges and tracking
- **`/login`** + `/signup` — Auth forms (any credentials work)

## Stack

| Layer    | Choice               |
| -------- | -------------------- |
| Frontend | Next.js 16, React 19 |
| Styling  | Tailwind CSS v4      |
| Language | TypeScript           |
| Images   | next/image + Unsplash CDN |
| Avatars  | DiceBear API         |
| Data     | In-memory mock data (`src/lib/mock-data.ts`) |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's mocked

Everything that would touch a real backend: auth, listings persistence, image uploads, payments, real-time chat, notifications. Forms submit to setState and pretend it worked.

## What's next (per the spec)

This is the Frontend / Phase 0 build. Future phases would wire up:

- **Phase 1** — Real auth (NextAuth or Supabase), Postgres for listings, S3/R2 for uploads
- **Phase 2** — WebSocket-backed chat (Socket.io or Pusher), real profile reviews
- **Phase 3** — Stripe Connect for marketplace payouts, full order state machine
- **Phase 4** — Moderation tools, image AI, fraud detection

## License

Private demo build.
