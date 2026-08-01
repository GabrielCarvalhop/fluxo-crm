import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route
 * Handlers. Lê a sessão do cookie — a RLS do banco decide o que cada
 * usuário pode ver, então este client nunca usa a service_role key.
 *
 * Next 15: cookies() é assíncrono, por isso esta função também é.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component (sem permissão de
            // escrever cookie) — inofensivo enquanto o middleware refresca
            // a sessão em toda navegação.
          }
        },
      },
    }
  );
}
