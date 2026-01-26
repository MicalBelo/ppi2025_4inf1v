import "./styles/theme.css";
import "./styles/global.css";
import { ProductList } from "./components/ProductList";
import { Header } from "./components/Header";
import { Route, Routes } from "react-router";
import { Cart } from "./components/Cart";
import { Admin } from "./components/Admin";
import { Manager } from "./components/Manager"; // Importação que faltava
import { CartProvider } from "./context/CartContext";
import { SessionProvider } from "./context/SessionContext";
import { Login } from "./components/Login";
import { ToastContainer } from "react-toastify";
import { User } from "./components/User";

export default function App() {
  return (
    <>
      <ToastContainer />
      <SessionProvider>
        <CartProvider>
          <Header />
          <Routes>
            {/* Rota Principal: Vitrine */}
            <Route path="/" element={<ProductList />} />
            
            {/* Rotas de Cliente */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<Login value="signin" />} />
            <Route path="/register" element={<Login value="register" />} />
            <Route path="/user" element={<User />} />

            {/* NOVAS ROTAS DE ADMINISTRAÇÃO */}
            {/* Painel de Pedidos/Pagamentos */}
            <Route path="/admin" element={<Admin />} /> 
            
            {/* Painel de Cadastro de Camisas/Produtos */}
            <Route path="/manager" element={<Manager />} /> 
          </Routes>
        </CartProvider>
      </SessionProvider>
    </>
  );
}