import styles from "./ProductTable.module.css";

import { useState, useEffect, useContext, useRef } from "react";
import { CartContext } from "../service/CartContext";
import { ProductRow } from "./ProductRow";

export function ProductTable() {
  const { products, loading, error } = useContext(CartContext);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const searchInput = useRef(null);

  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  function handleSearch() {
    const query = searchInput.current.value.toLowerCase();

    const filtered = products.filter((prod) =>
      prod.title.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
  }

  return (
    <table className={styles.table}>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Thumbnail</th>
        <th>Price</th>
        <th></th>
      </tr>
      {filteredProducts.map((prod) => (
        <ProductRow key={prod.id} product={prod} />
      ))}
    </table>
  );
}