import Link from "next/link";
export default function Home() {
  return (
    <main style={{padding:20,fontFamily:'system-ui, sans-serif'}}>
      <h1>Goldinvest — Home (pages/)</h1>
      <p>ถ้าเห็นหน้านี้ แปลว่าโปรเจกต์ Next.js ทำงาน และ routing พร้อมใช้งาน</p>
      <ul>
        <li><Link href="/api/plans/today">/api/plans/today</Link></li>
        <li><Link href="/health">/health (จาก app/ หรือ src/app ถ้ามี)</Link></li>
      </ul>
    </main>
  );
}
