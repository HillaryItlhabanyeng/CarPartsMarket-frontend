export function getProductFitment(product) {
  const vehicle = product?.vehicle || {};
  return {
    make: product?.vehicleMake || vehicle?.make || vehicle?.vehicleName || "",
    model: product?.vehicleModel || vehicle?.model || product?.model || "",
    year: String(product?.vehicleYear || vehicle?.year || ""),
    engine:
      product?.engineVariant ||
      product?.engineType ||
      vehicle?.engineType ||
      "",
    fuelType: product?.fuelType || vehicle?.fuelType || "",
  };
}

export function getSelectedVehicle() {
  try {
    return JSON.parse(localStorage.getItem("carpart_vehicle") || "null");
  } catch {
    return null;
  }
}

export function saveSelectedVehicle(vehicle) {
  localStorage.setItem("carpart_vehicle", JSON.stringify(vehicle));
}

export function vehicleLabel(vehicle) {
  if (!vehicle) return "";
  return [vehicle.make, vehicle.model, vehicle.year, vehicle.engine]
    .filter(Boolean)
    .join(" ");
}

export function productFitsVehicle(product, selected) {
  if (!selected?.make || !selected?.model || !selected?.year) return true;

  const fit = getProductFitment(product);
  const hasFitment = Boolean(fit.make && fit.model && fit.year);
  if (!hasFitment) return false;

  const same = (a, b) =>
    !b || String(a).toLowerCase() === String(b).toLowerCase();

  return (
    same(fit.make, selected.make) &&
    same(fit.model, selected.model) &&
    same(fit.year, selected.year) &&
    same(fit.engine, selected.engine)
  );
}
