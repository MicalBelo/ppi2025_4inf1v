import { useState } from "react";
import styles from "./Cart.module.css";

export function Cart({ cart, setCart, clearCart }) {
  
  const grouped = cart.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { ...item, quantity: 1 };
    } else {
      acc[item.id].quantity += 1;
    }
    return acc;
  }, {});
  const products = Object.values(grouped);

  function increaseQty(id) {
    const product = cart.find((p) => p.id === id);
    setCart([...cart, product]);
  }

  function decreaseQty(id) {
    const idx = cart.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const newCart = [...cart];
      newCart.splice(idx, 1);
      setCart(newCart);
    }
  }

  function removeItem(id) {
    setCart(cart.filter((p) => p.id !== id));
  }

  return (
    <div className={styles.cartPage}>
      <h2 className={styles.title}>Carrinho de Compras</h2>
      {products.length === 0 ? (
        <p className={styles.empty}>Seu carrinho está vazio.</p>
      ) : (
        <>
          <button className={styles.clearBtn} onClick={clearCart}>
            Remover todos os itens
          </button>
          <ul className={styles.cartList}>
            {products.map((product) => (
              <li key={product.id} className={styles.cartItem}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className={styles.thumb}
                />
                <div className={styles.info}>
                  <h3>{product.title}</h3>
                </div>
                <div className={styles.qtyControl}>
                  <button
                    onClick={() => decreaseQty(product.id)}
                    className={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    onClick={() => increaseQty(product.id)}
                    className={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className={styles.removeBtn}
                  title="Remover item"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}