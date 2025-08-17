import "./styles/theme.css";
import "./styles/global.css";

import { Header } from "./components/Header";
import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { CartProvider } from "./service/CartContext";
import { Routes, Route } from "react-router-dom";

export default function App() {
     return (
    //React Fragment
    <> <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </>
  );
}