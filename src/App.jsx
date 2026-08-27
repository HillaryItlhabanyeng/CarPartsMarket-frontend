import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import ScrollToTop from "./components/ui/ScrollToTop";
import AiAssistant from "./components/UserComps/AiAssistant";

import { loadUser } from "./redux-toolkit/actions/userActions";
import { loadSeller } from "./redux-toolkit/actions/sellerActions";
// REMOVE THIS FROM APP STARTUP IF POSSIBLE
// import { getAllProducts } from "./redux-toolkit/actions/productActions";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ActivationPage from "./pages/ActivationPage";
import SellerActivationPage from "./pages/SellerActivationPage";

import HomePage from "./pages/HomePage";
import VehicleFitmentPage from "./pages/VehicleFitmentPage";
import ProductPage from "./pages/ProductPage";
import BestSellingPage from "./pages/BestSellingPage";
import FaqPage from "./pages/FaqPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import ShopCreatePage from "./pages/ShopCreatePage";
import ShopLoginPage from "./pages/ShopLoginPage";
import ShopHomePage from "./pages/ShopHomePage";

import ProtectedRoute from "./routes/ProtectedRoute";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

import ShopDashboardPage from "./pages/ShopDashboardPage";
import ShopCreateProduct from "./components/SellerComps/ShopCreateProduct";
import ShopAllProducts from "./components/SellerComps/ShopAllProducts";
import ShopAllCoupons from "./components/SellerComps/ShopAllCoupons";
import ShopPreviewPage from "./components/SellerComps/ShopPreviewPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ShopAllOrders from "./components/SellerComps/ShopAllOrders";
import OrderDetails from "./components/SellerComps/OrderDetails";
import UserOrderDetails from "./components/UserComps/UserOrderDetails";
import TrackOrderPage from "./pages/TrackOrderPage";
import ShopAllRefunds from "./components/SellerComps/ShopAllRefunds";
import ShopSettingsPage from "./pages/ShopSettingsPage";
import ShopWithdrawMoneyPage from "./pages/ShopWithdrawMoneyPage";
import ShopInboxPage from "./pages/ShopInboxPage";
import UserInbox from "./components/UserComps/UserInbox";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAllUsersPage from "./pages/AdminAllUsersPage";
import AdminAllSellersPage from "./pages/AdminAllSellersPage";
import AdminAllOrdersPage from "./pages/AdminAllOrdersPage";
import AdminAllProductsPage from "./pages/AdminAllProductsPage";
import AdminWithdrawPage from "./pages/AdminWithdrawPage";
import AdminVehicleDatabasePage from "./pages/AdminVehicleDatabasePage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Don't create loadStripe() on every render.
let stripePromise = null;

if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
}

function App() {
  const dispatch = useDispatch();

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      try {
        // These can run in parallel.
        await Promise.allSettled([
          dispatch(loadUser()),
          dispatch(loadSeller()),
        ]);

        // IMPORTANT:
        // Don't load ALL products here.
        //
        // dispatch(getAllProducts());
        //
        // Let ProductPage/HomePage fetch only what they actually need.
      } catch (error) {
        console.error("App initialization error:", error);
      } finally {
        if (mounted) {
          setAppLoading(false);
        }
      }
    };

    initializeApp();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const routes = useMemo(
    () => (
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation/:url" element={<ActivationPage />} />
        <Route
          path="/seller/activation/:url"
          element={<SellerActivationPage />}
        />

        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/vehicle-fitment" element={<VehicleFitmentPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/faq" element={<FaqPage />} />

        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />

        {/* User */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <UserOrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/track-order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Seller */}
        <Route path="/shop-create" element={<ShopCreatePage />} />

        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-settings"
          element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-refunds"
          element={
            <SellerProtectedRoute>
              <ShopAllRefunds />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-coupons"
          element={
            <SellerProtectedRoute>
              <ShopAllCoupons />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-messages"
          element={
            <SellerProtectedRoute>
              <ShopInboxPage />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-withdraw-money"
          element={
            <SellerProtectedRoute>
              <ShopWithdrawMoneyPage />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <OrderDetails />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />

        <Route path="/order/success" element={<OrderSuccessPage />} />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <AdminProtectedRoute>
              <AdminAllUsersPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-sellers"
          element={
            <AdminProtectedRoute>
              <AdminAllSellersPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-orders"
          element={
            <AdminProtectedRoute>
              <AdminAllOrdersPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-products"
          element={
            <AdminProtectedRoute>
              <AdminAllProductsPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-withdraw-request"
          element={
            <AdminProtectedRoute>
              <AdminWithdrawPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-vehicles"
          element={
            <AdminProtectedRoute>
              <AdminVehicleDatabasePage />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    ),
    []
  );

  if (appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      {stripePromise ? (
        <Elements stripe={stripePromise}>
          {routes}
        </Elements>
      ) : (
        routes
      )}

      <AiAssistant />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        toastClassName="!rounded-xl !border !border-ink-100 !shadow-panel !font-sans"
        progressClassName="!bg-brand-600"
      />
    </BrowserRouter>
  );
}

export default App;