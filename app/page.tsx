async function getToday() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/plans/today`, { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const { ok, data } = await getToday();

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Goldinvest — Today Plan</h1>

      {!ok && <p className="text-red-600">Cannot load data.</p>}
      {ok && (!data || data.length === 0) && <p>No plans for today yet.</p>}

      <div className="grid gap-3">
        {ok && data?.map((p: any) => (
          <div key={p.id} className="border rounded p-3">
            <div className="flex items-center gap-2 text-sm opacity-70">
              <span>{p.plan_date}</span> • <span>{p.session}</span> • <span>{p.zone_type}</span>
            </div>

            <div className="mt-1 space-y-1">
              <div><b>Buy</b>: {p.buy_low} – {p.buy_high}</div>
              <div><b>TP</b>: {p.tp_low} – {p.tp_high} • <b>SL</b>: {p.sl}</div>
              <div><b>Confidence</b>: {p.confidence}%</div>
              {p.conditions?.length > 0 && (
                <div><b>Conditions</b>: {p.conditions.join(", ")}</div>
              )}
              {(p.hist_win_rate != null) && (
                <div className="text-sm opacity-80">
                  Stats30d — WR {p.hist_win_rate}% • Avg ${p.hist_avg_pnl} • DD {p.hist_max_dd}
                </div>
              )}
              {p.note && <div className="text-sm">Note: {p.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
