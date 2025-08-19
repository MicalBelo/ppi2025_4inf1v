import styles from "./Product.module.css";

import { useContext } from "react";
import { CartContext } from "../service/CartContext";
import { Link } from "react-router";

export function Product({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img src={product.thumbnail} />
      </div>
      <div className={styles.infoContainer}>
        <h2 className={styles.productTitle}>{product.title}</h2>
        <p className={styles.productPrice}>$ {product.price}</p>
        <p className={styles.productDesc}>{product.description}</p>
      </div>

      <button className={styles.addButton} onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}