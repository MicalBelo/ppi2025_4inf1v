import styles from "./Cart.module.css";

import { useContext } from "react";
import { CartContext } from "../service/CartContext";

export function Cart() {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <div className={styles.cart}>
      <div className={styles.head}>
        <p>Shopping Cart</p>
        <button
          className={styles.removeAll}
           onClick={() => clearCart()}
        >
          Remove all products
        </button>
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className={styles.prodList}>
          {cart.map((product, index) => (
            <li key={index}>
              <div className={styles.prodImgContainer}>
                <img src={product.thumbnail} alt={product.title} />
              </div>

              <div className={styles.prodInfoContainer}>
                <h3>{product.title}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>

              <div className={styles.prodQtyContainer}>
                <span>Quantity</span>

                <div className={styles.qtyProduct}>
                  <button onClick={() => removeFromCart(product.id)}>-</button>
                  <span>{product.qty}</span>
                  <button onClick={() => addToCart(product)}>+</button>
                </div>
              </div>

              <div className={styles.totalPriceContainer}>
                <span>Total:</span>
                <p>$ {(product.price * product.qty).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}