import styles from "./ProductList.module.css";

import { useContext, useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Product } from "../components/Product";
import { CartContext } from "../service/CartContext";

export function ProductList() {
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

    const filtered = products.filter(
      (prod) =>
        prod.title.toLowerCase().includes(query) ||
        prod.description.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
  }

  function handleClear() {
    searchInput.current.value = "";
    setFilteredProducts(products);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          ref={searchInput}
          type="text"
          placeholder="Search products..."
          className={styles.searchInput}
          onChange={handleSearch}
        />
        <button className={styles.searchButton} onClick={handleClear}>
          CLEAR
        </button>
      </div>
      <div className={styles.productsList}>
        {filteredProducts.map((prod) => (
          <Product key={prod.id} product={prod} />
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <CircularProgress
            thickness={5}
            sx={{ color: "blue" }}
            style={{ margin: "2rem auto", display: "block" }}
          />
          <p>Loading products...</p>
        </div>
      )}

      {error && <p>Error loading products: {error.message}</p>}
    </div>
  );
}