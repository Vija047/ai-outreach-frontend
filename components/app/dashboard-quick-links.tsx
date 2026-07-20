import Link from "next/link";
import {
  IconBrandGoogle,
  IconHistory,
  IconTemplate,
  IconUser,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function DashboardQuickLinks() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">Quick links</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-auto justify-start gap-3 px-4 py-3" asChild>
          <Link href="/history">
            <IconHistory className="size-4 shrink-0" stroke={1.5} />
            <span className="text-left">
              <span className="block text-sm font-medium">View history</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Past generations and copy
              </span>
            </span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto justify-start gap-3 px-4 py-3" asChild>
          <Link href="/templates">
            <IconTemplate className="size-4 shrink-0" stroke={1.5} />
            <span className="text-left">
              <span className="block text-sm font-medium">Browse templates</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Email and LinkedIn starters
              </span>
            </span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto justify-start gap-3 px-4 py-3" asChild>
          <Link href="/onboarding">
            <IconUser className="size-4 shrink-0" stroke={1.5} />
            <span className="text-left">
              <span className="block text-sm font-medium">Edit your profile</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Role, services, and default tone
              </span>
            </span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-auto cursor-not-allowed justify-start gap-3 px-4 py-3 opacity-60"
          disabled
          title="Gmail integration coming soon"
        >
          <IconBrandGoogle className="size-4 shrink-0" stroke={1.5} />
          <span className="text-left">
            <span className="block text-sm font-medium">Connect Gmail</span>
            <span className="block text-xs font-normal text-muted-foreground">
              Coming soon: save drafts to Gmail
            </span>
          </span>
        </Button>
      </div>
    </section>
  );
}
