import Header from "../components/Layouts/Header";
import BestDeals from "../components/UserComps/BestDeals";
import Categories from "../components/UserComps/Categories";
import FeaturedProducts from "../components/UserComps/FeaturedProducts";
import Footer from "../components/UserComps/Footer";
import Hero from "../components/UserComps/Hero";
import VehicleFinder from "../components/UserComps/VehicleFinder";

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <Header activeHeading={1} />
      <main className="flex-1">
        <Hero />
        <VehicleFinder />
        <Categories />
        <BestDeals />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
