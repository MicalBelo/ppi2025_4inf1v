import styles from "./ProductList.module.css";
import { CircularProgress } from "@mui/material";
import { Product } from "./Product";
import { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";

export function ProductList() {
  const { products, loading, error } = useContext(CartContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchInput = useRef(null);

  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  // --- NOVA FUNÇÃO DE FILTRO POR ANO ---
  function handleFilterByYear(year) {
    if (year === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.ano === year);
      setFilteredProducts(filtered);
    }
  }

  function handleSearch() {
    const query = searchInput.current.value.toLowerCase();
    setFilteredProducts(
      products.filter((product) =>
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      )
    );
  }

  function handleClear() {
    searchInput.current.value = "";
    setFilteredProducts(products);
  }

  return (
    <div className={styles.container}>
      {/* 1. CONTAINER DE BUSCA (Já existia) */}
      <div className={styles.searchContainer}>
        <input
          ref={searchInput}
          type="text"
          placeholder="Pesquisar camisas..."
          className={styles.searchInput}
          onChange={handleSearch}
        />
        <button className={styles.searchButton} onClick={handleClear}>
          LIMPAR
        </button>
      </div>

      {/* 2. NOVO: BARRA DE FILTROS POR ANO (Coloque exatamente aqui) */}
      <div className={styles.filterBar} style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button className={styles.filterButton} onClick={() => handleFilterByYear("all")}>Todos</button>
        <button className={styles.filterButton} onClick={() => handleFilterByYear(1)}>1º Ano</button>
        <button className={styles.filterButton} onClick={() => handleFilterByYear(2)}>2º Ano</button>
        <button className={styles.filterButton} onClick={() => handleFilterByYear(3)}>3º Ano</button>
        <button className={styles.filterButton} onClick={() => handleFilterByYear(4)}>4º Ano</button>
      </div>

      {/* 3. LISTAGEM DE PRODUTOS */}
      <div className={styles.productList}>
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress
            thickness={5}
            style={{ margin: "2rem auto", display: "block" }}
            sx={{ color: "#001111" }}
          />
          <p>Carregando camisas...</p>
        </div>
      )}
      {error && <p>❌ {error}</p>}
    </div>
  );
}
