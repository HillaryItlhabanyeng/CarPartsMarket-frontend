import { useState } from "react";
import AdminLayout from "../components/AdminComps/AdminLayout";

const initialRows = [
  { make: "Toyota", model: "Hilux", year: "2018", engine: "2.8 GD-6", parts: 42 },
  { make: "Ford", model: "Ranger", year: "2020", engine: "2.0 Bi-Turbo", parts: 31 },
  { make: "Volkswagen", model: "Polo", year: "2019", engine: "1.0 TSI", parts: 27 },
];

function AdminVehicleDatabasePage() {
  const [rows, setRows] = useState(initialRows);
  const [form, setForm] = useState({ make: "", model: "", year: "", engine: "" });

  function submit(e) {
    e.preventDefault();
    if (!form.make || !form.model || !form.year) return;
    setRows(current => [{ ...form, parts: 0 }, ...current]);
    setForm({ make: "", model: "", year: "", engine: "" });
  }

  const input = "h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

  return (
    <AdminLayout active={6} title="Vehicle database" subtitle="Manage makes, models, years and engine variants used for part fitment." wide>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <h2 className="font-display text-lg font-bold text-ink-900">Add vehicle fitment</h2>
          <p className="mt-1 text-sm text-ink-500">This becomes the source of truth for seller compatibility.</p>
          <div className="mt-5 space-y-3">
            {[["make", "Make"], ["model", "Model"], ["year", "Year"], ["engine", "Engine / variant"]].map(([key, label]) => (
              <input key={key} className={input} placeholder={label} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
            ))}
          </div>
          <button className="mt-4 h-11 w-full rounded-xl bg-brand-600 font-bold text-white hover:bg-brand-700">Add fitment</button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="border-b border-ink-100 p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Supported vehicles</h2>
            <p className="mt-1 text-sm text-ink-500">{rows.length} fitment records in this demo view.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500"><tr><th className="px-5 py-3">Make</th><th className="px-5 py-3">Model</th><th className="px-5 py-3">Year</th><th className="px-5 py-3">Engine</th><th className="px-5 py-3">Parts</th></tr></thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((row, i) => <tr key={`${row.make}-${row.model}-${row.year}-${i}`}><td className="px-5 py-4 font-semibold text-ink-900">{row.make}</td><td className="px-5 py-4 text-ink-700">{row.model}</td><td className="px-5 py-4 text-ink-600">{row.year}</td><td className="px-5 py-4 text-ink-600">{row.engine || "All variants"}</td><td className="px-5 py-4 font-semibold text-brand-700">{row.parts}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminVehicleDatabasePage;
