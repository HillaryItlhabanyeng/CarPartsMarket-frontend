// import { useRef, useState } from "react";
import "./Footer.css";

function Footer() {

  return (
    <footer className="footer">
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
            </footer>
  );
}

export default Footer;