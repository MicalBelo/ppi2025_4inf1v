import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({
  //Context to manage the product state
  products: [],
  loading: false,
  error: null,

  //Context to manage the cart state
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  var category = "smartphones";
  var limit = 10;
  var apiUrl = `https://dummyjson.com/products/category/${category}?limit=${limit}&select=id,thumbnail,title,price,description`;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((prevCart) => {
      if (prevCart.find((prod) => prod.id === product.id)) {
        return prevCart.map((prod) =>
          prod.id === product.id ? { ...prod, qty: prod.qty + 1 } : prod
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  }

  function removeFromCart(productId) {
    setCart((prevCart) => {
      const prod = prevCart.find((p) => p.id === productId);

      if (!prod) return prevCart;

      if (prod.qty === 1) {
        return prevCart.filter((p) => p.id !== productId);
      } else {
        return prevCart.map((p) =>
          p.id === productId ? { ...p, qty: p.qty - 1 } : p
        );
      }
    });
  }

  function clearCart() {
    setCart([]);
  }

  const context = {
    products: products,
    loading: loading,
    error: error,
    cart: cart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
  };

  return (
    <CartContext.Provider value={context}>{children}</CartContext.Provider>
  );
}