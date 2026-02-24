import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ server дээр л ашиглана
  );

  // Хэрвээ user-аар ялгах бол энд userId авах хэрэгтэй (Clerk/session).
  // Түр жишээ болгож бүх дата тооллоо.
  const [
    { count: chartsCreated, error: e1 },
    { count: filesUploaded, error: e2 },
  ] = await Promise.all([
    supabase.from("chart_history").select("*", { count: "exact", head: true }),
    supabase.from("uploaded_files").select("*", { count: "exact", head: true }),
  ]);

  if (e1 || e2) {
    return NextResponse.json(
      { error: e1?.message ?? e2?.message ?? "Failed to fetch stats" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    chartsCreated: chartsCreated ?? 0,
    filesUploaded: filesUploaded ?? 0,
  });
}
