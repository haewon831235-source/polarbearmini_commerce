"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

type NavLink = { href: string; label: string };

export function MobileNav({ links, cartLabel, cartCount }: {
  links: NavLink[];
  cartLabel: string;
  cartCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="메뉴 열기"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="16" y2="16" />
            <line x1="16" y1="2" x2="2" y2="16" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="5" x2="16" y2="5" />
            <line x1="2" y1="9" x2="16" y2="9" />
            <line x1="2" y1="13" x2="16" y2="13" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-background shadow-md">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-muted-foreground transition-colors hover:text-foreground border-b border-border last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {cartLabel}
              {cartCount > 0 && (
                <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
