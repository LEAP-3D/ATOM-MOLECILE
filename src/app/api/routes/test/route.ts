import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ error: "id шаардлагатай" }, { status: 400 });
    }

    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id буруу байна" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.rpc("execute_readonly_sql", {
      q: "SELECT elem FROM uploaded_files uf CROSS JOIN LATERAL jsonb_array_elements(uf.content) AS elem WHERE uf.id = 82 AND elem->>'gender' = 'female'",
    });
    console.log(data);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("🔥 test-raw error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Алдаа гарлаа" },
      { status: 500 }
    );
  }
}
