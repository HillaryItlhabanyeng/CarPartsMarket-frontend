import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./CategoriesPage.css";
import { FaShoppingCart } from "react-icons/fa";
import Footer from "../Components/Footer";

// Product interface matching ProductDetailsPage
interface Product {
    id: string | number;
    name: string;
    price: number;
    image: string;
    category?: string;
    description?: string;
    brand?: string;
    rating?: number;
    reviews?: number;
    available?: number;
    colors?: string[];
    sizes?: string[];
    reviewsList?: any[];
}

const products: Product[] = [
    {
        id: 1,
        name: "Brake Pad Set",
        price: 650.00,
        image: "brakepad.jpg",
        category: "Brakes",
        description: "Ceramic front brake pad set for reliable stopping power.",
        brand: "Bosch",
        rating: 4.5,
        reviews: 140,
        available: 20,
    },
    {
        id: 2,
        name: "Engine Oil Filter",
        price: 120.00,
        image: "engineoil.jpg",
        category: "Engine Parts",
        brand: "Mann Filter",
        rating: 4.4,
        reviews: 95,
        available: 60,
    },
    {
        id: 3,
        name: "Alloy Wheel Rim 17\"",
        price: 2450.00,
        image: "wheels.jpg",
        category: "Tyres & Wheels",
        brand: "Enkei",
        rating: 4.6,
        reviews: 55,
        available: 8,
    },
    {
        id: 4,
        name: "Shock Absorber",
        price: 1150.00,
        image: "absorber.jpg",
        category: "Suspension",
        brand: "Monroe",
        rating: 4.3,
        reviews: 70,
        available: 14,
    },
    {
        id: 5,
        name: "12V Car Battery",
        price: 1899.99,
        image: "12v.jpg",
        category: "Batteries & Electrical",
        brand: "Exide",
        rating: 4.5,
        reviews: 180,
        available: 12,
    },
    {
        id: 6,
        name: "Stainless Exhaust Muffler",
        price: 2200.00,
        image: "exhaust-muffler.jpg",
        category: "Exhaust Systems",
        brand: "Walker",
        rating: 4.2,
        reviews: 40,
        available: 6,
    },
    {
        id: 7,
        name: "Front Bumper Panel",
        price: 3200.00,
        image: "panel.jpg",
        category: "Body & Panels",
        brand: "OEM",
        rating: 4.0,
        reviews: 22,
        available: 5,
    },
    {
        id: 8,
        name: "LED Headlight Kit",
        price: 899.99,
        image: "led.jpg",
        category: "Lighting",
        brand: "Philips",
        rating: 4.7,
        reviews: 210,
        available: 25,
    },
    {
        id: 9,
        name: "Steering Wheel Cover",
        price: 199.99,
        image: "cover.jpg",
        category: "Interior Accessories",
        brand: "Streetwize",
        rating: 4.1,
        reviews: 65,
        available: 40,
    },
    {
        id: 10,
        name: "Full Synthetic Engine Oil 1L",
        price: 550.00,
        image: "oil5L.jpg",
        category: "Oil & Fluids",
        brand: "Castrol",
        rating: 4.8,
        reviews: 300,
        available: 45,
    },
    {
        id: 11,
        name: "Socket Wrench Set",
        price: 899.00,
        image: "sockets.jpg",
        category: "Tools & Equipment",
        brand: "Stanley",
        rating: 4.6,
        reviews: 150,
        available: 18,
    },
    {
        id: 12,
        name: "Car Phone Mount",
        price: 149.99,
        image: "mount.jpg",
        category: "Other Parts",
        brand: "Baseus",
        rating: 4.3,
        reviews: 110,
        available: 55,
    },
    {
        id: 13,
        name: "Spark Plug Set",
        price: 320.00,
        image: "spark plug set.jpg",
        category: "Engine Parts",
        brand: "NGK",
        rating: 4.5,
        reviews: 130,
        available: 35,
    },
    {
        id: 14,
        name: "All-Season Tyre 205/55R16",
        price: 1650.00,
        image: "tryes.jpg",
        category: "Tyres & Wheels",
        brand: "Michelin",
        rating: 4.7,
        reviews: 260,
        available: 16,
    },
    {
        id: 15,
        name: "Brake Disc Rotor",
        price: 780.00,
        image: "dics.jpg",
        category: "Brakes",
        brand: "Brembo",
        rating: 4.6,
        reviews: 90,
        available: 10,
    },
];

const categories = [
    { name: "Engine Parts", image: "engine parts.jpg", route: "/shop/engine-parts" },
    { name: "Brakes", image: "brakes.jpg", route: "/shop/brakes" },
    { name: "Tyres & Wheels", image: "wheels.jpg", route: "/shop/tyres-wheels" },
    { name: "Suspension", image: "suspension.jpg", route: "/shop/suspension" },
    { name: "Batteries & Electrical", image: "batteries.jpg", route: "/shop/batteries-electrical" },
    { name: "Exhaust Systems", image: "systems.jpg", route: "/shop/exhaust-systems" },
    { name: "Body & Panels", image: "body.jpg", route: "/shop/body-panels" },
    { name: "Lighting", image: "lights.jpg", route: "/shop/lighting" },
    { name: "Interior Accessories", image: "interior.jpg", route: "/shop/interior-accessories" },
    { name: "Oil & Fluids", image: "oil.jpg", route: "/shop/oil-fluids" },
    { name: "Tools & Equipment", image: "tools.jpg", route: "/shop/tools-equipment" },
    { name: "Other Parts", image: "other.jpg", route: "/shop/other-parts" },
];

export default function CategoriesPage() {
    const navigate = useNavigate();

    const handleProductClick = (product: Product) => {
        navigate("/product-details", { state: { product } });
    };

    return (
        <div className="categoryContainer">
            <Navbar />

            {/* Category Section */}
            <section className="categorySection">
                <div className="categoryCardsCollection">
                    {categories.map((cat) => (
                        <div className="categoryCardss" key={cat.name}>
                            <h1 className="categoryCardsText">{cat.name}</h1>
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="categoryImages"
                                onClick={() => navigate(cat.route)}
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

                <div className="categoryProductsCardsCollection">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="categoryProductsCardss"
                            onClick={() => handleProductClick(product)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="categoryProductsImages"
                            />
                            <h1 className="categoryProductsCardsText">
                                {product.name}
                            </h1>
                            <div className="categoryProductsCollection2">
                                <p className="categoryProductsPrice">
                                    R {product.price.toFixed(2)}
                                </p>
                                <button
                                    className="categoryProductsAddToCart"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductClick(product);
                                    }}
                                >
                                    <FaShoppingCart />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
