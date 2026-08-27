import { useEffect, useState } from "react";
import Header from "../components/Layouts/Header";
import styles from "../styles/styles";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/UserComps/Footer";
import PageHero from "../components/ui/PageHero";
import ProductGrid from "../components/ui/ProductGrid";
import { productFitsVehicle } from "../lib/fitment";

function ProductPage() {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const vehicleRaw = searchParams.get("vehicle");
  const vehicleData = vehicleRaw ? new URLSearchParams(vehicleRaw) : null;
  const [dataa, setDataa] = useState([]);
  const { allProducts, isLoading } = useSelector(state => state.product);

  useEffect(() => {
    let data = allProducts || [];
    if (categoryData) data = data.filter(item => item?.category === categoryData);

    if (vehicleData) {
      const selected = {
        make: vehicleData.get("make") || "",
        model: vehicleData.get("model") || "",
        year: vehicleData.get("year") || "",
        engine: vehicleData.get("engine") || "",
      };
      data = data.filter(product => productFitsVehicle(product, selected));
    }
    setDataa(data);
  }, [categoryData, allProducts, vehicleRaw]);

  const vehicleLabel = vehicleData
    ? [vehicleData.get("make"), vehicleData.get("model"), vehicleData.get("year"), vehicleData.get("engine")]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeHeading={2} />
      <PageHero
        eyebrow="CarPart Marketplace"
        title={categoryData || "Car Parts"}
        subtitle={
          vehicleData
            ? `Showing parts compatible with ${vehicleLabel}.`
            : categoryData
              ? `Browse car parts listed under ${categoryData}.`
              : "Browse car parts from marketplace sellers and filter by your vehicle."
        }
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Car Parts", to: categoryData ? "/products" : undefined },
          ...(categoryData ? [{ label: categoryData }] : []),
        ]}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-[13px] font-semibold text-ink-600">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          {dataa.length} part{dataa.length === 1 ? "" : "s"}
        </span>
        {vehicleData && (
          <span className="inline-flex items-center gap-2 rounded-full border border-success-100 bg-success-50 px-4 py-2 text-[13px] font-semibold text-success-700">
            ✓ {vehicleLabel}
          </span>
        )}
      </PageHero>

      <main className={`${styles.section} flex-1 py-12`}>
        <ProductGrid
          products={dataa}
          loading={isLoading && dataa.length === 0}
          skeletonCount={10}
          emptyTitle="No compatible parts found"
          emptyMessage={
            vehicleData
              ? "Try another vehicle, category or engine variant."
              : categoryData
                ? `No car parts are listed under ${categoryData} yet.`
                : "No car parts have been listed yet."
          }
        />
      </main>
      <Footer />
    </div>
  );
}

export default ProductPage;
