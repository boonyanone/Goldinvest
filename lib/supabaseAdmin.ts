// server-only Supabase client (ใช้ service_role key เฉพาะฝั่งเซิร์ฟเวอร์)
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ***ใช้เฉพาะฝั่ง server เท่านั้น***
  { auth: { persistSession: false } }
);
