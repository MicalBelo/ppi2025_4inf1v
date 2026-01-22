import styles from "./Product.module.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export function Product({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div key={product.id} className={styles.productCard}>
      <img
        src={product.thumbnail}
        alt={product.title}
        className={styles.productImage}
      />
      <h2 className={styles.productTitle}>{product.title}</h2>
      
      {/* EXIBINDO ANO E TURMA DO IF MACAU */}
      <div className={styles.badgeInfo}>
        <p><strong>{product.ano}º Ano</strong> - Turma {product.turma}</p>
      </div>

      <p className={styles.productDescription}>{product.description}</p>
      <p className={styles.productPrice}>R$ {product.price}</p>

      {/* LÓGICA DO BOTÃO EXPIRADO */}
      <button
        onClick={() => {
          if (!product.expirado) addToCart(product);
        }}
        className={product.expirado ? styles.buttonDisabled : styles.productButton}
        disabled={product.expirado}
      >
        {product.expirado ? "VENDA ENCERRADA" : "ADICIONAR AO CARRINHO"}
      </button>
    </div>
  );
}