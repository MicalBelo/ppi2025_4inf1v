import { ShoppingBasket } from "lucide-react";
import styles from "./Header.module.css";
import { Link } from "react-router";

export function Header({ cart }) {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.link}><h1>TJA Megastore</h1></Link>
      <Link to="/cart" className={styles.link}>
        <div className={styles.cartInfo}>
          <ShoppingBasket size={32} />
          <p>
            {cart.length === 0
              ? "Carrinho vazio"
              : `Total: $${cart.reduce((total, product) => total + product.price, 0).toFixed(2)}`}
          </p>
        </div>
      </Link>
    </div>
  );
}