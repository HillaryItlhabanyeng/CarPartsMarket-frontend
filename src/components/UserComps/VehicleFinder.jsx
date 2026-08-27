import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiSearch } from "react-icons/fi";
import { saveSelectedVehicle, vehicleLabel } from "../../lib/fitment";

const vehicles = {
  Toyota: {
    Hilux: { years: ["2024","2023","2022","2021","2020","2019","2018"], engines: ["2.8 GD-6", "2.4 GD-6", "2.4 GD-6 4x4"] },
    Corolla: { years: ["2024","2023","2022","2021","2020","2019"], engines: ["1.8", "2.0"] },
    Fortuner: { years: ["2024","2023","2022","2021","2020","2019"], engines: ["2.8 GD-6", "2.4 GD-6"] },
    RAV4: { years: ["2024","2023","2022","2021","2020"], engines: ["2.0", "2.5"] },
  },
  Ford: {
    Ranger: { years: ["2024","2023","2022","2021","2020"], engines: ["2.0 Bi-Turbo", "2.0 Single Turbo", "3.0 V6"] },
    Everest: { years: ["2024","2023","2022","2021","2020"], engines: ["2.0 Bi-Turbo", "3.0 V6"] },
  },
  Volkswagen: {
    Polo: { years: ["2024","2023","2022","2021","2020","2019"], engines: ["1.0 TSI", "1.0 MPI"] },
    Golf: { years: ["2024","2023","2022","2021","2020"], engines: ["1.4 TSI", "1.5 TSI"] },
  },
  BMW: {
    "3 Series": { years: ["2024","2023","2022","2021","2020"], engines: ["320i", "330i"] },
    "5 Series": { years: ["2024","2023","2022","2021","2020"], engines: ["520i", "530i"] },
  },
  "Mercedes-Benz": {
    "C-Class": { years: ["2024","2023","2022","2021","2020"], engines: ["C200", "C300"] },
    "E-Class": { years: ["2024","2023","2022","2021","2020"], engines: ["E200", "E300"] },
  },
  Nissan: {
    Navara: { years: ["2024","2023","2022","2021","2020","2019"], engines: ["2.3 dCi", "2.5 dCi"] },
    NP200: { years: ["2020","2019","2018","2017"], engines: ["1.6"] },
    Qashqai: { years: ["2024","2023","2022","2021","2020"], engines: ["1.3 DIG-T", "1.5 dCi"] },
  },
};

const selectClass = "h-12 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm font-medium text-ink-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

function VehicleFinder({ compact = false }) {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({ make: "", model: "", year: "", engine: "" });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("carpart_vehicle") || "null");
      if (saved) setVehicle({ make: "", model: "", year: "", engine: "", ...saved });
    } catch {}
  }, []);

  const modelData = vehicles[vehicle.make]?.[vehicle.model];
  const makes = Object.keys(vehicles);
  const models = vehicle.make ? Object.keys(vehicles[vehicle.make] || {}) : [];
  const years = modelData?.years || [];
  const engines = modelData?.engines || [];

  function update(key, value) {
    setVehicle(current => ({ ...current, [key]: value }));
  }

  function findParts(e) {
    e.preventDefault();
    if (!vehicle.make || !vehicle.model || !vehicle.year) return;
    saveSelectedVehicle(vehicle);
    const params = new URLSearchParams(vehicle);
    navigate(`/products?vehicle=${encodeURIComponent(params.toString())}`);
  }

  return (
    <section className={compact ? "" : "relative z-20 -mt-12 px-4"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`${compact ? "" : "mx-auto max-w-6xl"} rounded-3xl border border-ink-100 bg-white p-5 shadow-panel md:p-7`}
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Vehicle fitment</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-ink-900">Find parts for your exact vehicle</h2>
            <p className="mt-1 text-sm text-ink-500">Select your vehicle before comparing compatible CarParts.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-success-50 px-3 py-2 text-xs font-semibold text-success-700 sm:flex">
            <FiCheckCircle /> Compatibility first
          </div>
        </div>

        <form onSubmit={findParts} className="grid gap-3 md:grid-cols-5">
          <select value={vehicle.make} onChange={e => setVehicle({ make: e.target.value, model: "", year: "", engine: "" })} className={selectClass} required>
            <option value="">Make</option>
            {makes.map(make => <option key={make}>{make}</option>)}
          </select>
          <select value={vehicle.model} onChange={e => setVehicle(v => ({ ...v, model: e.target.value, year: "", engine: "" }))} className={selectClass} disabled={!vehicle.make} required>
            <option value="">Model</option>
            {models.map(model => <option key={model}>{model}</option>)}
          </select>
          <select value={vehicle.year} onChange={e => update("year", e.target.value)} className={selectClass} disabled={!modelData} required>
            <option value="">Year</option>
            {years.map(year => <option key={year}>{year}</option>)}
          </select>
          <select value={vehicle.engine} onChange={e => update("engine", e.target.value)} className={selectClass} disabled={!modelData}>
            <option value="">Engine / variant</option>
            {engines.map(engine => <option key={engine}>{engine}</option>)}
          </select>
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 font-display font-bold text-white shadow-card transition hover:bg-brand-700">
            <FiSearch /> Find compatible parts
          </button>
        </form>

        {vehicle.make && vehicle.model && (
          <p className="mt-4 text-xs font-semibold text-ink-500">
            Selected: <span className="text-ink-800">{vehicleLabel(vehicle)}</span>
          </p>
        )}
      </motion.div>
    </section>
  );
}

export default VehicleFinder;
