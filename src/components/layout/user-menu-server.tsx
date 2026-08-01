import { getAuthUser, getCurrentProfile } from "@/lib/queries/reference";
import { UserMenu } from "./user-menu";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * O nome de exibição vive em `profiles` (editável em Configurações), não no
 * Auth. Buscar isso no layout bloquearia o shell inteiro, então este pedaço
 * é servido em streaming via Suspense — a sidebar e a topbar pintam antes.
 */
export async function UserMenuServer() {
  const [user, profile] = await Promise.all([getAuthUser(), getCurrentProfile()]);

  return (
    <UserMenu
      name={profile?.full_name || user?.email || "Você"}
      email={profile?.email || user?.email || ""}
    />
  );
}

export function UserMenuFallback() {
  return <Skeleton className="size-7 rounded-full" />;
}
