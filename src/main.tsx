import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./Components/CartContext";
import { SavedProvider } from "./Components/SavedContext";
import { OrdersProvider } from "./Components/OrdersContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <SavedProvider>
        <OrdersProvider>
          <App />
        </OrdersProvider>
      </SavedProvider>
    </CartProvider>
  </StrictMode>
);