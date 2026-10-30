import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import AddressPage from "./Pages/AddressPage";
import SettingsPage from "./Pages/SettingsPage";

import AccountPage from "./Pages/AccountPage";
import MarketPlacePage from "./Pages/MarketPlacePage";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";

import DetailsPage from "./Pages/DetailsPage";
import PaymentPage from "./Pages/PaymentPage";
import ConfirmationPage from "./Pages/ConfirmationPage";

import ContactPage from "./Pages/ContactPage";
import RatingsreviewsPage from "./Pages/RatingsreviewsPage";
import CategoriesPage from "./Pages/CategoriesPage";

import MyListingsPage from "./Pages/MyListingsPage";
import SavedPage from "./Pages/SavedPage";
import BuyingPage from "./Pages/BuyingPage";
import OrderDetailPage from "./Pages/OrderDetailPage";
import BulletinBoardPage from "./Pages/BulletinBoardPage";
import DashboardPage from "./Pages/DashboardPage";
import AddressesPage from "./Pages/AddressesPage";

import NotificationsPage from "./Pages/NotificationsPage";
import MessagesPage from "./Pages/MessagesPage";
import ServicesPage from "./Pages/ServicesPage";
import AnnouncementsPage from "./Pages/AnnouncementsPage";
import EventsPage from "./Pages/EventsPage";

import OTPPage from "./Pages/OTPPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import LandingPage from "./Pages/LandingPage";

import ProductListingPage from "./Pages/ProductListingPage";
import ProfilePage from "./Pages/ProfilePage";
import ProductDetailsPage from "./Pages/ProductDetailsPage";
import AdminPage from "./Pages/AdminPage";
import AdminUsersPage from "./Pages/AdminUsersPage";
import AdminListingsPage from "./Pages/AdminListingsPage";
import AdminOrdersPage from "./Pages/AdminOrdersPage";
import SellerOrdersPage from "./Pages/SellerOrdersPage";
import ShippingPage from "./Pages/ShippingPage";
import ProtectedRoute from "./Components/ProtectedRoute";

// Small helpers so each route stays readable
const loggedIn = (page: ReactNode) => <ProtectedRoute>{page}</ProtectedRoute>;
const buyerOnly = (page: ReactNode) => <ProtectedRoute allowedRoles={["buyer"]}>{page}</ProtectedRoute>;
const sellerOnly = (page: ReactNode) => <ProtectedRoute allowedRoles={["seller"]}>{page}</ProtectedRoute>;
const adminOnly = (page: ReactNode) => <ProtectedRoute allowedRoles={["admin"]}>{page}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Authentication (public) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Account (any logged-in user) */}
        <Route path="/account" element={loggedIn(<AccountPage />)} />
        <Route path="/profile" element={loggedIn(<ProfilePage />)} />
        <Route path="/settings" element={loggedIn(<SettingsPage />)} />
        <Route path="/addresses" element={loggedIn(<AddressesPage />)} />

        {/* Seller */}
        <Route path="/dashboard" element={sellerOnly(<DashboardPage />)} />
        <Route path="/list-product" element={sellerOnly(<ProductListingPage />)} />
        <Route path="/my-listings" element={sellerOnly(<MyListingsPage />)} />
        <Route path="/seller-orders" element={sellerOnly(<SellerOrdersPage />)} />

        {/* Marketplace (public browsing) */}
        <Route path="/shop" element={<MarketPlacePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/product-details" element={<ProductDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/* Buyer */}
        <Route path="/saved" element={buyerOnly(<SavedPage />)} />
        <Route path="/wishlist" element={buyerOnly(<SavedPage />)} />
        <Route path="/buying" element={buyerOnly(<BuyingPage />)} />
        <Route path="/orders" element={buyerOnly(<BuyingPage />)} />

        {/* Order details: buyer, seller or admin */}
        <Route path="/orders/:reference" element={loggedIn(<OrderDetailPage />)} />

        {/* Cart / Checkout (buyer) */}
        <Route path="/cart" element={buyerOnly(<CartPage />)} />
        <Route path="/checkout" element={buyerOnly(<CheckoutPage />)} />
        <Route path="/checkout/details" element={buyerOnly(<DetailsPage />)} />
        <Route path="/checkout/payment" element={buyerOnly(<PaymentPage />)} />
        <Route path="/checkout/confirmation" element={buyerOnly(<ConfirmationPage />)} />

        {/* Community */}
        <Route path="/bulletin-board" element={<BulletinBoardPage />} />
        <Route path="/messages" element={loggedIn(<MessagesPage />)} />
        <Route path="/notifications" element={loggedIn(<NotificationsPage />)} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin */}
        <Route path="/admin" element={adminOnly(<AdminPage />)} />
        <Route path="/admin/users" element={adminOnly(<AdminUsersPage />)} />
        <Route path="/admin/listings" element={adminOnly(<AdminListingsPage />)} />
        <Route path="/admin/orders" element={adminOnly(<AdminOrdersPage />)} />

        {/* Not sure who uses this yet, so left public */}
        <Route path="/shipping" element={<ShippingPage />} />

        {/* Reviews */}
        <Route path="/ratings-reviews" element={<RatingsreviewsPage />} />
        <Route path="/ratingsreviews" element={<RatingsreviewsPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;