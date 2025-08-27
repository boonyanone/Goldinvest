import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok:true, msg:"API OK (root app/)" });
}
