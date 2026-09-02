import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv, type Db } from "./client";
import type { Database } from "./database.types";

/** Server-side Supabase client bound to the request's auth cookies. */
export async function createServerSupabase(): Promise<Db> {
  const cookieStore = await cookies();
  const { url, key } = supabaseEnv();
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; the proxy refreshes cookies instead.
        }
      },
    },
  });
}
