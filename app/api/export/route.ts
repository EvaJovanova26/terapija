import { NextResponse } from "next/server";
import { entriesToCsv } from "@/lib/csv";
import { createServerSupabase } from "@/lib/supabase/server";
import { fetchAllEntries } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

/** Every entry, every column, as CSV. RLS scopes it to the signed-in user. */
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Sign in first.", { status: 401 });

  const entries = await fetchAllEntries(supabase);
  return new NextResponse(entriesToCsv(entries), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="baseline-entries.csv"',
      "Cache-Control": "no-store",
    },
  });
}
