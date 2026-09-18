import "./LandingPage.css";
// import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    FaSearch, FaHandshake, FaTruckMoving, FaShoppingCart, FaWallet,
    FaMapPin, FaAward, FaEnvelope, FaPhone, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn
} from "react-icons/fa";
import { useState } from "react";
import Footer from "../Components/Footer";


function LandingPage() {
    //  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
    const navigate = useNavigate();
    //     const handleTabChange = (tab: "active" | "sold", path: string) => {
    //     setActiveTab(tab);
    //     navigate(path);
    //   };

    const [form] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });

    // const handleLogIn = () => {
    //     // TODO: replace with actual navigation (e.g. react-router's navigate('/login'))
    //     console.log('Navigate to sign-in');
    //     navigate("/categories");
    // };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     setForm({ ...form, [e.target.name]: e.target.value });
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Hook up to your backend / email service here
        console.log("Contact form submitted:", form);
    };

    return (

        <div className="landingContainer">

            {/* home section */}
            <section className="landingSection">
                <div className="landingTexts">
                <p className="landingMiniText">Your number one secure marketplace.</p>
                <p className="landingHeadText">Trade With Total Confendence.</p>
                {/* <img src="/logo-recolored.png" alt="PartLink Logo" className="Landinglogo" /> */}
                <p className="landingText">Connecting buyers and sellers across multiple categories.
                    Experience transparent pricing, escrow style payment protection and seamless
                    logistic coordination
                </p>

                <div className="landingButtons">
                    <button className="landingButton1" onClick={() => navigate("/register")}>Get Started</button>
                    <button className="landingButton2" onClick={() => navigate("/login")}>Log in</button>
                </div>

                </div>
                {/* <div className="landingHomeImageContainer">
                </div> */}

            </section>

            {/* ===================================================service======================================== */}

            <section className="servicesSection">
                <div className="servicePromoCards">

                    <div className="serviceCards" >
                        <div className="serviceIconsContainer">
                            <FaWallet className="serviceIcons" />
                        </div>
                        <p className="serviceCardsText">secure payment</p>
                    </div>

                    <div className="serviceCards" >
                        <div className="serviceIconsContainer">
                            <FaHandshake className="serviceIcons" />
                        </div>
                        <p className="serviceCardsText">Trusted sellers</p>
                    </div>

                    <div className="serviceCards" >
                        <div className="serviceIconsContainer">
                            <FaAward className="serviceIcons" />
                        </div>
                        <p className="serviceCardsText">quality products</p>
                    </div>

                    <div className="serviceCards" >
                        <div className="serviceIconsContainer">
                            <FaTruckMoving className="serviceIcons" />
                        </div>
                        <p className="serviceCardsText">Fast Delivery</p>
                    </div>

                    <div className="serviceCards" >
                        <div className="serviceIconsContainer">
                            <FaSearch className="serviceIcons" />
                        </div>
                        <p className="serviceCardsText">Easy to find products</p>
                    </div>

                </div>
            </section>

            {/* ===============================================category list==================================================== */}
            <section className="landingCategorySection">
                <h1 className="landingSectionTitle">We got everything you need for your car</h1>
                <p className="landingCategotyText">Browse by category.</p>

                <div className="homeCategoryCards3">

                    <div className="categoryCards3">
                        <h1 className="categoryCards3Title">Batteries</h1>
                        <img src="/battery.png" alt="PartLink Logo" className="categoryImage1" onClick={() => navigate("/login")}/>
                    </div>

                    <div className="categoryCards3">
                        <h1 className="categoryCards3Title">Electronic</h1>
                        <img src="/backlight.jpg" alt="PartLink Logo" className="categoryImage1" onClick={() => navigate("/login")}/>
                    </div>

                    <div className="categoryCards3">
                        <h1 className="categoryCards3Title">Clutches</h1>
                        <img src="/clutch.png" alt="PartLink Logo" className="categoryImage1" onClick={() => navigate("/login")}/>
                    </div>

                    <div className="categoryCards3">
                        <h1 className="categoryCards3Title">Engines</h1>
                        <img src="/engine.png" alt="PartLink Logo" className="categoryImage1" onClick={() => navigate("/login")}/>
                    </div>

                    <div className="categoryCards3">
                        <h1 className="categoryCards3Title">Fluids</h1>
                        <img src="/fluids.png" alt="PartLink Logo" className="categoryImage1" onClick={() => navigate("/login")}/>
                    </div>

                    <div className="categoryCards3">
                        <h1 className="categoryCards3Title">Transimissions</h1>
                        <img src="/transmissions.png" alt="PartLink Logo" className="categoryImage1" onClick={() => navigate("/login")}/>
                    </div>

                    <div className="categoryCards3">
                        <h2 className="categoryCards3Title">Suspensions</h2>
                        <img src="/suspension.png" alt="PartLink Logo" className="categoryImage1" onClick={() => navigate("/login")}/>
                    </div>

                </div>

                <button className="landingView" role="button"  onClick={() => navigate("/login")}

            >View All</button>
            </section>

            {/* ========================================================Promo================================================= */}

            <section className="landingSectionPromo">
                
                {/* <div className="promoDeco"></div> */}
                {/* <div className="promoDeco1"></div> */}
                <img src="interior-decoration.png" alt="PartLink Logo" className="promoDeco" />
                <h1 className="landingSectionPromoTitle">Car essentials at every price</h1>
                {/* <img src="back-to-school-laptop.png" alt="PartLink Logo" className="promoRightImage" /> */}
            </section>

            {/* ========================================================Trending============================================== */}
            <section className="landingTrandingSection">
                <h1 className="landingTrandingTitle">Trending</h1>

                <div className="landingTrandingCards">

                    <div className="trandingCards">
                        <img src="/wheel-cap.png" alt="PartLink Logo" className="trandingImage" />

                        <div className="trandingButtonContainer">
                            <h2 className="trandingProductName">VW Wheel decal cap</h2>
                            <h2 className="trandingProductPrice">R799.99</h2>
                            {/* <button className="trandingButton">
                                <FaShoppingCart /> Add to cart
                            </button> */}
                        </div>
                    </div>

                    <div className="trandingCards">
                        <img src="/lights.png" alt="PartLink Logo" className="trandingImage" />

                        <div className="trandingButtonContainer">
                            <h2 className="trandingProductName">headlights</h2>
                            <h2 className="trandingProductPrice">R429.99</h2>
                            {/* <button className="trandingButton">
                                <FaShoppingCart /> Add to cart
                            </button> */}
                        </div>
                    </div>

                    <div className="trandingCards">
                        <img src="/tires.png" alt="PartLink Logo" className="trandingImage" />

                        <div className="trandingButtonContainer">
                            <h2 className="trandingProductName">Tires</h2>
                            <h2 className="trandingProductPrice">R379.99</h2>
                            {/* <button className="trandingButton">
                                <FaShoppingCart /> Add to cart
                            </button> */}
                        </div>
                    </div>

                    <div className="trandingCards">
                        <img src="/fluids.png" alt="PartLink Logo" className="trandingImage" />

                        <div className="trandingButtonContainer">
                            <h2 className="trandingProductName">Fluids</h2>
                            <h2 className="trandingProductPrice">R80.00</h2>
                            {/* <button className="trandingButton">
                                <FaShoppingCart /> Add to cart
                            </button> */}
                        </div>
                    </div>

                    <div className="trandingCards">
                        <img src="/car-diffuser.png" alt="PartLink Logo" className="trandingImage" />

                        <div className="trandingButtonContainer">
                            <h2 className="trandingProductName">Car diffuser</h2>
                            <h2 className="trandingProductPrice">R67.90</h2>
                            {/* <button className="trandingButton">
                                <FaShoppingCart /> Add to cart
                            </button> */}
                        </div>
                    </div>

                </div>
            </section>

            {/*===================================================================contact==================================  */}
            <section className="landingContactSection">
                <div className="landingContactHeading">
                    <h1>Contact us</h1>
                    <p>We'll like to hear from you! Reach out to us for any question, feedback or support</p>
                </div>

                {/* Content */}
                <div className="landingContactContent">
                    <div className="landingContactCard">
                        <h3>CONTACT INFORMATION</h3>

                        <div className="landingContactInfoRow">
                            <div className="landingContactIconContainer">
                                <FaMapPin className="landingContactInfoIcon" />
                            </div>
                            <div>
                                <strong>Address</strong>
                                <p>
                                    Cape Peninsula University of Technology
                                    <br />
                                    District Six Campus, Cape Town, 7925
                                </p>
                            </div>
                        </div>

                        <div className="landingContactInfoRow">
                            <div className="landingContactIconContainer">
                                <FaEnvelope className="landingContactInfoIcon" />
                            </div>
                            <div>
                                <strong>Email</strong>
                                <p>Support@unitrade.co.za</p>
                            </div>
                        </div>

                        <div className="landingContactInfoRow">
                            <div className="landingContactIconContainer">
                                <FaPhone className="landingContactInfoIcon" />
                            </div>
                            <div>
                                <strong>Phone</strong>
                                <p>+27 21 489 1397</p>
                            </div>
                        </div>

                        <div className="landingContactInfoRow">
                            <div className="landingContactIconContainer">
                                <FaClock className="landingContactInfoIcon" />
                            </div>
                            <div>
                                <strong>Hours</strong>
                                <p>
                                    Monday - Friday: 08:00-17:00
                                    <br />
                                    Saturday - Sunday: Closed
                                </p>
                            </div>
                        </div>

                        <div className="landingContactInfoRow">
                            <div className="mediaContainer">
                                <FaFacebookF className="landingContactMediaIcon" />
                                <FaTwitter className="landingContactMediaIcon" />
                                <FaInstagram className="landingContactMediaIcon" />
                                <FaLinkedinIn className="landingContactMediaIcon" />
                                
                            </div>
                            {/* <div>
                                <strong>Phone</strong>
                                <p>+27 21 489 1397</p>
                            </div> */}
                        </div>
                    </div>

                    <div className="landingContactCard1">
                        <h3>SEND US A MESSAGE</h3>
                        <form onSubmit={handleSubmit} className="landingContactForm">

                            <div className="landingMessageform-group">
                                <label>Full name</label>
                                <input type="text" placeholder="" required />
                            </div>

                            <div className="landingMessageform-group">
                                <label>Email</label>
                                <input type="text" placeholder="" required />
                            </div>

                            <div className="landingMessageform-group">
                                <label>Subject</label>
                                <input type="text" placeholder="" required />
                            </div>

                            <div className="message-group">
                                <label>Message</label>
                                <input className="landingContactField" type="text" placeholder="" required />
                            </div>

                            <button type="submit" className="landingContactSubmit">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ============================================================footer========================================= */}

            {/* <footer className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <img src="/logo-recolored.png" alt="PartLink Logo" className="footer-logo" />
                        <p className="footer-description">
                            A premier marketplace connecting buyers and sellers with secure transactions, transparent pricing, and streamlined logistics.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-heading">MARKETPLACE</h3>
                        <ul className="footer-links">
                            <li><a href="#">All Categories</a></li>
                            <li><a href="#">Electronics</a></li>
                            <li><a href="#">Home & Bedding</a></li>
                            <li><a href="#">Fashion</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-heading">SELLERS</h3>
                        <ul className="footer-links">
                            <li><a href="#">Onboarding</a></li>
                            <li><a href="#">Storefront Setup</a></li>
                            <li><a href="#">Fees & Pricing</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-heading">SUPPORT</h3>
                        <p className="footer-support-text">
                            Need help with an escrow payment or logistics coordination?
                        </p>
                        <button className="footer-support-btn">Contact Support</button>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 UNITRADE MARKETPLACE</p>
                </div>
            </footer> */}

            <Footer />
        </div>


    );
}
export default LandingPage;