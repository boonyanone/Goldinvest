async function getPlans() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/plans/today`, { cache: "no-store" });
  return res.json();
}

export default async function Home() {
  const { ok, data } = await getPlans();
  return (
    <main style={{padding:20,fontFamily:'system-ui, sans-serif'}}>
      <h1 style={{fontSize:24,fontWeight:700}}>Goldinvest — Today Plan (App Router)</h1>
      {!ok && <p style={{color:'crimson'}}>Cannot load data.</p>}
      {ok && (!data || data.length===0) && <p>No plans for today yet.</p>}
      <div style={{display:'grid',gap:12}}>
        {ok && data?.map((p:any)=>(
          <div key={p.id} style={{border:'1px solid #ddd',borderRadius:8,padding:12}}>
            <div style={{opacity:.7,fontSize:12}}>{p.plan_date} • {p.session} • {p.zone_type}</div>
            <div><b>Buy</b>: {p.buy_low} – {p.buy_high}</div>
            <div><b>TP</b>: {p.tp_low} – {p.tp_high} • <b>SL</b>: {p.sl}</div>
            <div><b>Confidence</b>: {p.confidence}%</div>
            {p.conditions?.length>0 && <div><b>Conditions</b>: {p.conditions.join(", ")}</div>}
            {p.hist_win_rate!=null && (
              <div style={{opacity:.8,fontSize:12}}>
                Stats30d — WR {p.hist_win_rate}% • Avg ${p.hist_avg_pnl} • DD {p.hist_max_dd}
              </div>
            )}
            {p.note && <div style={{fontSize:12}}>Note: {p.note}</div>}
          </div>
        ))}
      </div>
    </main>
  );
}
