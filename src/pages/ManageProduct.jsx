import styles from "./ManageProduct.module.css";

import { ProductTable } from "../components/ProductTable";
import { Link } from "react-router";
import { CirclePlus } from "lucide-react";

export function ManageProducts() {
  return (
    <div className={styles.container}>
      <div className={styles.addButton}>
        <Link to="/update-product">
          <button><CirclePlus size={16} /> ADD</button>
        </Link>
      </div>
      <ProductTable />
    </div>
  );
}