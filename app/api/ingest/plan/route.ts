import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

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
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  type Item = {
    session: "ASIA" | "EUROPE" | "US";
    zone_type: "MAIN" | "BACKUP";
    buy_zone: [number, number];
    tp_zone: [number, number];
    sl: number;
    confidence: number;
    conditions: string[];
    historical?: { win_rate?: number; avg_pnl?: number; max_dd?: number };
    note?: string;
  };

  const body = JSON.parse(raw) as { version: string; plan_date: string; items: Item[] };
  const { plan_date, items } = body;

  const rows = items.map((it) => ({
    plan_date,
    session: it.session,
    zone_type: it.zone_type,
    buy_low: it.buy_zone[0],
    buy_high: it.buy_zone[1],
    tp_low: it.tp_zone[0],
    tp_high: it.tp_zone[1],
    sl: it.sl,
    confidence: it.confidence,
    conditions: it.conditions,
    hist_win_rate: it.historical?.win_rate ?? null,
    hist_avg_pnl: it.historical?.avg_pnl ?? null,
    hist_max_dd: it.historical?.max_dd ?? null,
    note: it.note ?? null,
  }));

  const { error } = await supabaseAdmin.from("plans").insert(rows);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, inserted: rows.length });
}
