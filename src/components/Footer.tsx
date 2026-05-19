import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-[color:var(--primary)] grid place-items-center text-[color:var(--primary-foreground)] font-bold text-sm">
              m
            </div>
            <span className="font-bold">malcale</span>
          </div>
          <p className="text-[color:var(--muted-foreground)]">
            Buy and sell pre-loved fashion. Give your closet a second life.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Marketplace</h4>
          <ul className="space-y-2 text-[color:var(--muted-foreground)]">
            <li><Link href="/?category=women" className="hover:text-[color:var(--foreground)]">Women</Link></li>
            <li><Link href="/?category=men" className="hover:text-[color:var(--foreground)]">Men</Link></li>
            <li><Link href="/?category=kids" className="hover:text-[color:var(--foreground)]">Kids</Link></li>
            <li><Link href="/?category=shoes" className="hover:text-[color:var(--foreground)]">Shoes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Selling</h4>
          <ul className="space-y-2 text-[color:var(--muted-foreground)]">
            <li><Link href="/listings/new" className="hover:text-[color:var(--foreground)]">List an item</Link></li>
            <li><Link href="/settings/payouts" className="hover:text-[color:var(--foreground)]">Payout settings</Link></li>
            <li><Link href="/orders" className="hover:text-[color:var(--foreground)]">My orders</Link></li>
            <li><span>Seller fees: 5%</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-[color:var(--muted-foreground)]">
            <li><span>About</span></li>
            <li><span>Help center</span></li>
            <li><span>Terms · Privacy</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-[color:var(--muted-foreground)] flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} malcale. Demo build — no real transactions.</span>
          <span>Made with care.</span>
        </div>
      </div>
    </footer>
  );
}
