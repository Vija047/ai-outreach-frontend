"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  IconHistory,
  IconHome,
  IconLogout,
  IconTemplate,
  IconUser,
} from "@tabler/icons-react";

import { CreditsBadge } from "@/components/app/credits-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-provider";
import { api, isProfileComplete } from "@/lib/api";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: IconHome },
  { href: "/history", label: "History", icon: IconHistory },
  { href: "/templates", label: "Templates", icon: IconTemplate },
  { href: "/onboarding", label: "Profile", icon: IconUser },
] as const;

function isNavActive(
  item: (typeof navItems)[number],
  pathname: string,
): boolean {
  if (item.href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/analyze";
  }
  if (item.href === "/history") {
    return pathname.startsWith("/history");
  }
  return pathname === item.href;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);

  const refreshCredits = useCallback(() => {
    setCreditsLoading(true);
    api
      .getCredits()
      .then((res) => setCreditsBalance(res.balance))
      .catch(() => setCreditsBalance(null))
      .finally(() => setCreditsLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    refreshCredits();
  }, [user, pathname, refreshCredits]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (
      profile &&
      !isProfileComplete(profile) &&
      pathname !== "/onboarding"
    ) {
      router.replace("/onboarding");
    }
  }, [user, profile, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-card/50 md:flex">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6">
          <AppLogo href="/dashboard" height={90} width={160} imageClassName="h-14 sm:h-16 w-auto -my-2" />
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isNavActive(item, pathname)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" stroke={1.5} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="shrink-0 border-t border-border p-4">
          <div className="mb-3 truncate text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <IconLogout className="size-4" stroke={1.5} />
            Log out
          </Button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:min-h-16 sm:px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2 md:hidden">
            <AppLogo href="/dashboard" height={80} width={140} imageClassName="h-12 sm:h-14 w-auto -my-1" />
          </div>
          <div className="flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:ml-auto">
            <CreditsBadge
              balance={creditsBalance}
              plan={user.plan}
              loading={creditsLoading}
              className="max-w-[9.5rem] truncate sm:max-w-none"
            />
            <ThemeToggle />
            <span className="hidden rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-wide lg:inline lg:px-3 lg:text-xs">
              {user.plan} plan
            </span>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 pb-20 sm:p-4 sm:pb-20 md:p-6 md:pb-6 lg:p-8 lg:pb-8">
          {children}
        </main>

        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
        >
          <div className="grid grid-cols-4 gap-0.5 px-1 py-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors active:scale-[0.98] sm:text-[11px]",
                  isNavActive(item, pathname)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-5 shrink-0" stroke={1.5} />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
