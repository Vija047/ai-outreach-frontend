"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavbarMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav className={cn("relative z-50 w-full", className)}>{children}</nav>
  );
}

export function MenuItem({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 -translate-x-1/2 pt-4">
              <motion.div
                transition={{ type: "spring", duration: 0.5 }}
                layoutId="active"
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl backdrop-blur-sm"
              >
                <motion.div layout className="p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export function Menu({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative hidden items-center justify-center space-x-6 lg:flex"
    >
      {children}
    </nav>
  );
}

export function HoveredLink({
  href,
  children,
  ...rest
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      {...rest}
      className="text-neutral-700 hover:text-black dark:text-neutral-200 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export function MobileNav({
  links,
  cta,
}: {
  links: { label: string; href: string }[];
  cta: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        className="flex size-9 items-center justify-center rounded-md border border-border"
      >
        <span className="sr-only">Menu</span>
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "block h-0.5 w-4 bg-foreground transition-transform",
              open && "translate-y-1.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-4 bg-foreground transition-opacity",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-4 bg-foreground transition-transform",
              open && "-translate-y-1.5 -rotate-45",
            )}
          />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full right-0 left-0 border-b border-border bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-4 p-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {cta}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
