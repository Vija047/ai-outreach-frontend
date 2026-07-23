import { AppShell } from "@/components/app/app-shell";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
