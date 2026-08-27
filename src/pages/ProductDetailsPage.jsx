import { useParams } from "react-router-dom";
import Header from "../components/Layouts/Header";
import { useEffect, useState } from "react";
import SuggestedProducts from "../components/UserComps/SuggestedProducts";
import Footer from "../components/UserComps/Footer";
import ProductDetails from "../components/UserComps/ProductDetails";
import { useSelector } from "react-redux";
import Loader from "../components/UserComps/Loader";

function ProductDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { allProducts, isLoading } = useSelector(state => state.product);

  useEffect(() => {
    setData(allProducts?.find(item => item?._id === id) || null);
    window.scrollTo(0, 0);
  }, [allProducts, id]);

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <Header />
      <main className="flex-1">
        {!data && isLoading ? (
          <Loader label="Loading car part" />
        ) : data ? (
          <>
            <ProductDetails data={data} />
            <SuggestedProducts data={data} />
          </>
        ) : (
          <div className="mx-auto max-w-4xl px-4 py-24 text-center">
            <h1 className="font-display text-2xl font-bold text-ink-900">Car part not found</h1>
            <p className="mt-2 text-ink-500">The part may have been removed or is no longer available.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetailsPage;
