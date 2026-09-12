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
        reviews: 180,
        available: 12,
    },
    {
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
        reviews: 130,
        available: 35,
    },
    {
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