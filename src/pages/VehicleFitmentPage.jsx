import Header from "../components/Layouts/Header";
import Footer from "../components/UserComps/Footer";
import VehicleFinder from "../components/UserComps/VehicleFinder";

function VehicleFitmentPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <Header activeHeading={3} />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Vehicle fitment</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink-900">Find parts made for your vehicle</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-600">Choose your vehicle once and CarPart Marketplace can filter the catalogue around compatibility, part category and seller.</p>
        </div>
        <VehicleFinder compact />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["OEM and aftermarket options", "Compare sellers and prices", "Track every order in one place"].map((title, i) => (
            <div key={title} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 font-bold text-brand-700">{i + 1}</div>
              <h3 className="mt-4 font-display font-bold text-ink-900">{title}</h3>
              <p className="mt-1 text-sm text-ink-500">Built into the buyer journey instead of treating compatibility as an afterthought.</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default VehicleFitmentPage;
