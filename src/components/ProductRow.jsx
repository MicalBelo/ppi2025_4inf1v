import { RefreshCcw, Trash2 } from "lucide-react";
import styles from "./ProductRow.module.css";

import { Link } from "react-router";

export function ProductRow({ product }) {
  return (
    <tr className={styles.productRow}>
      <td>{product.id}</td>
      <td>{product.title}</td>
      <td>
        <div className={styles.imgContainer}>
          <img src={product.thumbnail} />
        </div>
      </td>
      <td>{product.price.toFixed(2)}</td>
      <td>
        <div className={styles.buttons}>
          <Link to={`/update-product/${product.id}`}><button> <RefreshCcw size={16} />UPDATE</button></Link>
          <button><Trash2 size={16} />DELETE</button>
        </div>
      </td>
    </tr>
  );
}