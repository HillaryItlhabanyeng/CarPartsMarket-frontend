import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./CategoriesPage.css";
import { FaShoppingCart } from "react-icons/fa";
import Footer from "../Components/Footer";
import { partCategories } from "../data/partCategories";
import { getLiveListings, toDetailsProduct } from "../Components/marketListings";
import type { StoredListing } from "../Components/adminStore";

// Picture for each category tile (the categories themselves come from the shared list)
const categoryImages: Record<string, string> = {
    Brakes: "/brakes.jpg",
    Engine: "/engine parts.jpg",
    Electrical: "/batteries.jpg",
    Lighting: "/lights.jpg",
    Suspension: "/suspension.jpg",
    Interior: "/interior.jpg",
    "Body Parts": "/body.jpg",
    "Wheels & Tyres": "/wheels.jpg",
};

export default function CategoriesPage() {
    const navigate = useNavigate();
    const [products] = useState<StoredListing[]>(() => getLiveListings());

    const openProduct = (listing: StoredListing) => {
        navigate(`/product/${listing.id}`, { state: { product: toDetailsProduct(listing) } });
    };

    return (
        <div className="categoryContainer">
            <Navbar />

            {/* Category Section */}
            <section className="categorySection">
                <div className="categoryCardsCollection">
                    {partCategories.map((name) => (
                        <div className="categoryCardss" key={name}>
                            <h1 className="categoryCardsText">{name}</h1>
                            <img
                                src={categoryImages[name]}
                                alt={name}
                                className="categoryImages"
                                onClick={() => navigate(`/shop?category=${encodeURIComponent(name)}`)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section className="categoryProductsSection">
                <div className="categoryProductsSectionTitle">
                    <hr /><h2>For you</h2><hr />
                </div>

                {products.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#6b7a7f", padding: "24px 0" }}>
                        No parts have been listed yet. Approved seller listings appear here.
                    </p>
                ) : (
                    <div className="categoryProductsCardsCollection">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="categoryProductsCardss"
                                onClick={() => openProduct(product)}
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="categoryProductsImages"
                                />
                                <h1 className="categoryProductsCardsText">
                                    {product.title}
                                </h1>
                                <div className="categoryProductsCollection2">
                                    <p className="categoryProductsPrice">
                                        R {product.price.toFixed(2)}
                                    </p>
                                    <button
                                        className="categoryProductsAddToCart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openProduct(product);
                                        }}
                                    >
                                        <FaShoppingCart />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
