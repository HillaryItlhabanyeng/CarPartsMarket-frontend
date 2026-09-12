import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
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


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Account */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Marketplace */}
        <Route path="/shop" element={<MarketPlacePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/list-product" element={<ProductListingPage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/buying" element={<BuyingPage />} />
        <Route path="/orders/:reference" element={<OrderDetailPage />} />

        {/* Cart / Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/details" element={<DetailsPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route
          path="/checkout/confirmation"
          element={<ConfirmationPage />}
        />

        {/* Community */}
        <Route path="/bulletin-board" element={<BulletinBoardPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* <Route path="/landing" element={<LandingPage />} /> */}
        <Route path="/product-details" element={<ProductDetailsPage />} />



        {/* Reviews */}
        <Route
          path="/ratings-reviews"
          element={<RatingsreviewsPage />}
        />

        {/* Optional old URL */}
        <Route
          path="/ratingsreviews"
          element={<RatingsreviewsPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;