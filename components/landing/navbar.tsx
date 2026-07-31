"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { NavbarMenu, MobileNav } from "@/components/aceternity/navbar-menu";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppLogo } from "@/components/ui/logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50"
    >
      <NavbarMenu className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:h-24 md:px-6">
          <AppLogo href="/" height={120} width={200} imageClassName="h-20 sm:h-24 md:h-28 w-auto -my-3 sm:-my-4" />

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              Log in
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <ShimmerButton className="h-9 px-5 text-sm shadow-2xl">
                Get Started
              </ShimmerButton>
            </Link>
            <MobileNav
              links={navLinks}
              cta={
                <Link href="/signup">
                  <ShimmerButton className="h-9 w-full px-5 text-sm">
                    Get Started
                  </ShimmerButton>
                </Link>
              }
            />
          </div>
        </div>
      </NavbarMenu>
    </motion.div>
  );
}
