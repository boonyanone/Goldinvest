import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const SECRET = process.env.WEBHOOK_SECRET!;

function verifySignature(raw: string, signature: string) {
  const mac = crypto.createHmac("sha256", SECRET).update(raw).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(signature || "", "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-signature") || "";
  if (!verifySignature(raw, sig)) {
    return NextResponse.json({ ok:false, error:"invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(raw);

  let planId = body.plan_id as string | null;
  if (!planId) {
    if (!body.plan_date || !body.session || !body.zone_type) {
      return NextResponse.json({ ok:false, error:"missing plan_id or (plan_date, session, zone_type)" }, { status: 400 });
    }
    const { data: plan, error: qerr } = await supabaseAdmin
      .from("plans")
      .select("id")
      .eq("plan_date", body.plan_date)
      .eq("session", body.session)
      .eq("zone_type", body.zone_type)
      .limit(1)
      .maybeSingle();
    if (qerr || !plan) {
      return NextResponse.json({ ok:false, error:"plan not found" }, { status: 404 });
    }
    planId = plan.id;
  }

  const payload = {
    plan_id: planId,
    entry_price: body.entry_price ?? null,
    exit_price: body.exit_price ?? null,
    pnl_usd: body.pnl_usd ?? null,
    hit_tp: body.hit_tp ?? null,
    hit_sl: body.hit_sl ?? null,
    mfe: body.mfe ?? null,
    mae: body.mae ?? null,
    used_conditions: body.used_conditions ?? [],
    news_context: body.news_context ?? null,
    confidence_used: body.confidence_used ?? null,
    result: body.result,
    closed_at: body.closed_at ?? null
  };

  const { error } = await supabaseAdmin.from("executions").insert([payload]);
  if (error) {
    return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok:true });
}
