import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/queries/reference";
import { AppShell } from "@/components/layout/app-shell";
import { UserMenuServer, UserMenuFallback } from "@/components/layout/user-menu-server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // getUser() e cookies() são independentes — em paralelo para o shell pintar
  // o quanto antes. O nome do usuário entra depois, por Suspense.
  const [user, cookieStore] = await Promise.all([getAuthUser(), cookies()]);

  // O middleware já protege estas rotas; isto é só defesa extra.
  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell
      defaultCollapsed={cookieStore.get("sidebar-collapsed")?.value === "true"}
      userMenu={
        <Suspense fallback={<UserMenuFallback />}>
          <UserMenuServer />
        </Suspense>
      }
    >
      {children}
    </AppShell>
  );
}
