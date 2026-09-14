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
<<<<<<< HEAD
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
=======
        name: "Office chair",
        price: 1950,
        image: "/office.jpg",
        category: "Furniture",
        description: "A comfortable office chair for your workspace.",
        brand: "IKEA",
        rating: 4.2,
        reviews: 120,
        available: 15,
    },
    {
        id: 2,
        name: "Painting Frame",
        price: 150.00,
        image: "/painting-frame.png",
        category: "Home Decor",
        brand: "Artisan",
        rating: 4.5,
        reviews: 80,
        available: 10,
    },
    {
        id: 3,
        name: "Perfume",
        price: 999.99,
        image: "/perfume.png",
        category: "Beauty",
        brand: "Chanel",
        rating: 4.3,
        reviews: 200,
        available: 25,
    },
    {
        id: 4,
        name: "Pillow",
        price: 220.00,
        image: "/pillow.png",
        category: "Bedding",
        brand: "DreamCloud",
        rating: 4.6,
        reviews: 150,
        available: 30,
    },
    {
        id: 5,
        name: "HP Laptop",
        price: 7999.99,
        image: "/hp-laptop.jpg",
        category: "Electronics",
        brand: "HP",
        rating: 4.0,
        reviews: 90,
        available: 8,
    },
    {
        id: 6,
        name: "Soccer Boots",
        price: 1500.00,
        image: "/soccer-boots.png",
        category: "Sports",
        brand: "Nike",
        rating: 4.7,
        reviews: 300,
        available: 7,
    },
    {
        id: 7,
        name: "Flower Vase",
        price: 150.00,
        image: "/vase.png",
        category: "Home Decor",
        brand: "HomeStyle",
        rating: 4.1,
        reviews: 60,
        available: 18,
    },
    {
        id: 8,
        name: "A4 Counter Book",
        price: 89.99,
        image: "/a4.jpg",
        category: "Stationery",
        brand: "OfficePro",
        rating: 3.8,
        reviews: 45,
        available: 50,
    },
    {
        id: 9,
        name: "Adidas Shoes",
        price: 1250,
        image: "/adidas.jpg",
        category: "Sports",
        brand: "Adidas",
        rating: 4.9,
        reviews: 500,
        available: 15,
    },
    {
        id: 10,
        name: "Backpack",
        price: 450.00,
        image: "/backpack.jpg",
        category: "Accessories",
        brand: "NorthFace",
        rating: 4.4,
>>>>>>> f8e740661d6aa014a58bb2ef5629d22b109d5a4e
        reviews: 180,
        available: 12,
    },
    {
<<<<<<< HEAD
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
=======
        id: 11,
        name: "Cashio Calculator",
        price: 400.00,
        image: "/calculator.jpg",
        category: "Electronics",
        brand: "Casio",
        rating: 4.2,
        reviews: 95,
        available: 22,
    },
    {
        id: 12,
        name: "EarBuds",
        price: 180.00,
        image: "/earbuds.jpg",
        category: "Electronics",
        brand: "Sony",
        rating: 4.3,
        reviews: 210,
        available: 28,
    },
    {
        id: 13,
        name: "Denim Jacket",
        price: 559.99,
        image: "/denim-jacket.png",
        category: "Clothing",
        brand: "Levi's",
        rating: 4.5,
        reviews: 160,
        available: 14,
    },
    {
        id: 14,
        name: "Iphone 11",
        price: 5500.00,
        image: "/iphone.jpg",
        category: "Electronics",
        brand: "Apple",
        rating: 4.8,
        reviews: 800,
        available: 5,
    },
    {
        id: 15,
        name: "Kitchen Spoons",
        price: 220.00,
        image: "/kitchen.jpg",
        category: "Kitchen",
        brand: "KitchenAid",
        rating: 4.0,
        reviews: 75,
        available: 40,
    },
    {
        id: 16,
        name: "Nike Shoes",
        price: 1699.99,
        image: "/shoes.png",
        category: "Sports",
        brand: "Nike",
        rating: 4.8,
        reviews: 24200,
        available: 12,
        colors: ["#4CAF50", "#8BC34A", "#2E7D32"],
        sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
        reviewsList: [
            {
                name: "Christina Perry",
                date: "14 Nov. 2021",
                rating: 5,
                comment: "Thank you very fast shipping from Poland only 3days. Very Greatful.",
                helpful: 18240
            },
            {
                name: "Michael Johnson",
                date: "22 Oct. 2021",
                rating: 5,
                comment: "Thank you very fast shipping from Poland only 3days. Very Greatful.",
                helpful: 8240
            }
        ]
    },
    {
        id: 17,
        name: "Pot set",
        price: 850.00,
        image: "/trending1.png",
        category: "Kitchen",
        brand: "Tefal",
        rating: 4.3,
        reviews: 110,
        available: 16,
    },
    {
        id: 18,
        name: "Headphones",
        price: 430.00,
        image: "/trending2.jpg",
        category: "Electronics",
        brand: "Bose",
        rating: 4.7,
        reviews: 350,
        available: 20,
    },
    {
        id: 19,
        name: "Bluetooth Speaker",
        price: 390.00,
        image: "/trending3.jpg",
        category: "Electronics",
        brand: "JBL",
        rating: 4.4,
        reviews: 280,
        available: 18,
    },
    {
        id: 20,
        name: "Notebook",
        price: 109.99,
        image: "/trending4.webp",
        category: "Stationery",
        brand: "Moleskine",
        rating: 4.2,
>>>>>>> f8e740661d6aa014a58bb2ef5629d22b109d5a4e
        reviews: 130,
        available: 35,
    },
    {
<<<<<<< HEAD
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
=======
        id: 21,
        name: "Makeup Kit",
        price: 1299.99,
        image: "/makeup-kit.jpg",
        category: "Beauty",
        brand: "MAC",
        rating: 4.6,
        reviews: 220,
        available: 25,
    },
    {
        id: 22,
        name: "Microphone Headset",
        price: 1650.00,
        image: "/microphone.png",
        category: "Electronics",
        brand: "Logitech",
        rating: 4.1,
        reviews: 85,
        available: 30,
    },
    {
        id: 23,
        name: "Mirror",
        price: 550.00,
        image: "/mirror.png",
        category: "Home Decor",
        brand: "IKEA",
        rating: 3.9,
        reviews: 55,
        available: 22,
    },
    {
        id: 24,
        name: "Muffins",
        price: 4.00,
        image: "/muffins.png",
        category: "Food",
        brand: "FreshBake",
        rating: 4.5,
        reviews: 95,
        available: 40,
    },
>>>>>>> f8e740661d6aa014a58bb2ef5629d22b109d5a4e
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
<<<<<<< HEAD
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
=======
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Books</h1>
                        <img src="/books.png" alt="Books" className="categoryImages" onClick={() => navigate("/shop/books")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Clothes</h1>
                        <img src="/clothes.png" alt="Clothes" className="categoryImages" onClick={() => navigate("/shop/clothes")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Electronics</h1>
                        <img src="/mac.png" alt="Electronics" className="categoryImages" onClick={() => navigate("/shop/electronics")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Bedding</h1>
                        <img src="/bedding.jpg" alt="Bedding" className="categoryImages" onClick={() => navigate("/shop/bedding")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Kitchen</h1>
                        <img src="/kitchen.jpg" alt="Kitchen" className="categoryImages" onClick={() => navigate("/shop/kitchen")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Games</h1>
                        <img src="/puzzle.jpg" alt="Games" className="categoryImages" onClick={() => navigate("/shop/games")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Sports & outdoor</h1>
                        <img src="/sports.png" alt="Sports" className="categoryImages" onClick={() => navigate("")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Furniture</h1>
                        <img src="/mirror.png" alt="Furniture" className="categoryImages" onClick={() => navigate("")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Home</h1>
                        <img src="/deffuser.png" alt="Home" className="categoryImages" onClick={() => navigate("")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Jewelry</h1>
                        <img src="/accessories.png" alt="Jewelry" className="categoryImages" onClick={() => navigate("")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Office</h1>
                        <img src="/chair.png" alt="Office" className="categoryImages" onClick={() => navigate("")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Food</h1>
                        <img src="/chips.png" alt="Food" className="categoryImages" onClick={() => navigate("")} />
                    </div>
                    <div className="categoryCardss">
                        <h1 className="categoryCardsText">Other</h1>
                        <img src="/shoes.png" alt="Other" className="categoryImages" onClick={() => navigate("")} />
                    </div>
>>>>>>> f8e740661d6aa014a58bb2ef5629d22b109d5a4e
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
<<<<<<< HEAD
                            <img
                                src={product.image}
                                alt={product.name}
                                className="categoryProductsImages"
=======
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="categoryProductsImages" 
>>>>>>> f8e740661d6aa014a58bb2ef5629d22b109d5a4e
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
<<<<<<< HEAD
}
=======
}
>>>>>>> f8e740661d6aa014a58bb2ef5629d22b109d5a4e
