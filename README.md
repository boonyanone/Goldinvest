# Goldinvest (MVP)

Next.js (App Router) + Supabase + Webhook รับ JSON "แผนเทรดตอนเช้า"

## ขั้นตอนใช้งาน
1) สร้างโปรเจกต์ Supabase → เปิดหน้า SQL → รันไฟล์ `db/schema.sql`
2) ตั้งค่า ENV (ดู `.env.example`) ทั้งในเครื่องและบน Vercel
3) รัน dev:
```bash
npm i
npm run dev
```
4) ทดสอบ Webhook:
```bash
# สร้าง signature (HMAC-SHA256) ด้วย Node:
node -e "const fs=require('fs'),crypto=require('crypto');const raw=fs.readFileSync('plan.json');const mac=crypto.createHmac('sha256',process.env.WEBHOOK_SECRET||'change-this-to-a-long-random-string').update(raw).digest('hex');console.log(mac)"
# นำค่า <SIG> ไปใส่หัวข้อ X-Signature แล้วยิง:
curl -X POST http://localhost:3000/api/ingest/plan  -H "Content-Type: application/json"  -H "X-Signature: <SIG>"  --data-binary @plan.json
```
5) เปิดหน้า Today: http://localhost:3000

## Deploy บน Vercel
- เชื่อม GitHub repo, ตั้ง ENV, Deploy
