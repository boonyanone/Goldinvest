# Goldinvest — App Router Only (Clean)

โครง Next.js แบบ App Router ล้วน (ไม่มีโฟลเดอร์ `pages/`) พร้อม API:
- POST /api/ingest/plan        (รับ JSON แผนตอนเช้า + HMAC X-Signature)
- POST /api/ingest/execution   (บันทึกผล session)
- GET  /api/plans/today        (ดึงแผนของวันนี้)

## ขั้นตอน
1) Supabase → รัน `db/schema.sql`
2) ตั้งค่า ENV: `.env.local` (dev) และบน Vercel (prod)
3) รัน dev: `npm i && npm run dev`
4) ทดสอบ API:
   - `curl http://localhost:3000/api/plans/today`
   - สร้าง signature จาก plan.json แล้วยิงไปที่ `/api/ingest/plan`
5) Deploy Vercel

> หมายเหตุ: โปรเจกต์นี้ **ไม่มีโฟลเดอร์ `pages/`** เพื่อเลี่ยง conflict กับ App Router
