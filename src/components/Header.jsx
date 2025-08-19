import styles from "./Header.module.css";

import { ShoppingBasket, UserRound, Blocks } from "lucide-react";
import { Link } from "react-router";
import { useContext } from "react";
import { CartContext } from "../service/CartContext";

export function Header() {
  const { cart } = useContext(CartContext);
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.link}>
        <h1>TJA Megastore</h1>
      </Link>

      <div className={styles.container}>
        <Link to="/manage-products" className={styles.link}>
          <div className={styles.secContainer}>
            <Blocks />
            <p>Products</p>
          </div>
        </Link>

        <Link to="/cart" className={styles.link}>
          <div className={styles.cartInfo}>
            <ShoppingBasket size={24} />
            <p>{cart.reduce((total, prod) => total + prod.qty, 0)} items</p>
            <p>
              Total: ${" "}
              {cart
                .reduce((total, prod) => total + prod.price * prod.qty, 0)
                .toFixed(2)}
            </p>
          </div>
        </Link>

        <Link to="/login" className={styles.link}>
          <div className={styles.secContainer}>
            <UserRound />
            <p>Login</p>
          </div>
        </Link>
      </div>
    </div>
  );
}