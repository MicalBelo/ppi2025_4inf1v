import "./styles/theme.css";
import "./styles/global.css";

import { Login } from "./pages/Login";
import { ProductList } from "./pages/ProductList";
import { Cart } from "./pages/Cart";
import { SignUp } from "./pages/SignUp";
import { CartProvider } from "./service/CartContext";
import { Routes, Route } from "react-router";
import { Header } from "./components/Header";
import { ManageProducts } from "./pages/ManageProduct";
import { UpdateProduct } from "./pages/UpdateProduct";

export default function App() {
  return (
    //React Fragment
    <>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/update-product" element={<UpdateProduct />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
        </Routes>
      </CartProvider>
    </>
  );
}