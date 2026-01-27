import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "./SessionContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState("light");

  const { session } = useContext(SessionContext);
  const LOCAL_CART_KEY = "cart";
  const LOCAL_THEME_KEY = "theme";

  const persistLocalCart = (items) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch {}
  };

  const persistTheme = (value) => {
    try {
      localStorage.setItem(LOCAL_THEME_KEY, value);
      document.documentElement.setAttribute("data-theme", value);
    } catch {}
  };

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("product_1")
        .select("*")
        .eq("status", true)
        .order("ano", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        const agora = new Date();
        const produtosValidados = data.map(produto => ({
          ...produto,
          expirado: produto.data_limite ? new Date(produto.data_limite) < agora : false
        }));
        setProducts(produtosValidados);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const loadCartForUser = async (user_id) => {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select(`
          product_id,
          quantity,
          tamanho,
          product_1 (title, price, thumbnail, turma)
        `)
        .eq("user_id", user_id);

      if (error) return console.error("Error loading cart:", error);

      const loaded = data.map((row) => ({
        id: row.product_id,
        quantity: row.quantity,
        tamanho: row.tamanho || "", // Carrega o tamanho do banco
        title: row.product_1?.title,
        price: row.product_1?.price,
        thumbnail: row.product_1?.thumbnail,
        turma: row.product_1?.turma
      }));

      setCart(loaded);
    } catch (e) {
      console.error(e);
    }
  };

  const mergeLocalToRemote = async (user_id) => {
    try {
      const raw = localStorage.getItem(LOCAL_CART_KEY);
      if (!raw) return;
      const local = JSON.parse(raw);

      for (const item of local) {
        const { data: existing } = await supabase
          .from("cart")
          .select("quantity")
          .match({ user_id, product_id: item.id })
          .single();

        if (existing) {
          await supabase
            .from("cart")
            .update({ quantity: existing.quantity + item.quantity, tamanho: item.tamanho })
            .match({ user_id, product_id: item.id });
        } else {
          await supabase.from("cart").insert([{ 
            user_id, 
            product_id: item.id, 
            quantity: item.quantity,
            tamanho: item.tamanho || "" 
          }]);
        }
      }
      localStorage.removeItem(LOCAL_CART_KEY);
      await loadCartForUser(user_id);
    } catch (e) {
      console.error("Error merging cart:", e);
    }
  };

  const addToCart = async (product) => {
    const product_id = product.id;
    // Iniciamos com tamanho vazio ou um padrão se preferir
    const defaultTamanho = ""; 

    if (session?.user?.id) {
      const user_id = session.user.id;
      const { data: existing } = await supabase
        .from("cart")
        .select("quantity")
        .match({ user_id, product_id })
        .single();

      if (existing) {
        await supabase.from("cart")
          .update({ quantity: existing.quantity + 1 })
          .match({ user_id, product_id });
      } else {
        await supabase.from("cart").insert([{ 
          user_id, 
          product_id, 
          quantity: 1, 
          tamanho: defaultTamanho 
        }]);
      }
      await loadCartForUser(user_id);
    } else {
      setCart((prev) => {
        const existing = prev.find((it) => it.id === product_id);
        const next = existing
          ? prev.map((it) => (it.id === product_id ? { ...it, quantity: it.quantity + 1 } : it))
          : [...prev, { 
              id: product_id, 
              quantity: 1, 
              tamanho: defaultTamanho,
              title: product.title, 
              price: product.price, 
              thumbnail: product.thumbnail,
              turma: product.turma 
            }];
        persistLocalCart(next);
        return next;
      });
    }
  };

  // FUNÇÃO ATUALIZADA: Aceita quantidade e tamanho
  const updateQtyCart = async (productId, quantity, tamanho) => {
    if (session?.user?.id) {
      if (quantity <= 0) {
        await supabase.from("cart").delete().match({ user_id: session.user.id, product_id: productId });
      } else {
        // Atualiza quantidade E tamanho no Supabase
        await supabase.from("cart")
          .update({ quantity, tamanho })
          .match({ user_id: session.user.id, product_id: productId });
      }
      await loadCartForUser(session.user.id);
    } else {
      setCart((prev) => {
        const next = prev.map((item) => 
          item.id === productId ? { ...item, quantity, tamanho } : item
        );
        persistLocalCart(next);
        return next;
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (session?.user?.id) {
      await supabase.from("cart").delete().match({ user_id: session.user.id, product_id: productId });
      await loadCartForUser(session.user.id);
    } else {
      setCart((prev) => {
        const next = prev.filter((item) => item.id !== productId);
        persistLocalCart(next);
        return next;
      });
    }
  };

  const clearCart = async () => {
    if (session?.user?.id) {
      await supabase.from("cart").delete().eq("user_id", session.user.id);
      setCart([]);
    } else {
      setCart([]);
      persistLocalCart([]);
    }
  };

  useEffect(() => {
    async function init() {
      const storedTheme = localStorage.getItem(LOCAL_THEME_KEY) || "light";
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);

      if (session?.user?.id) {
        await mergeLocalToRemote(session.user.id);
        await loadCartForUser(session.user.id);
      } else {
        const rawCart = localStorage.getItem(LOCAL_CART_KEY);
        setCart(rawCart ? JSON.parse(rawCart) : []);
      }
    }
    init();
  }, [session]);

  return (
    <CartContext.Provider
      value={{
        products,
        loading,
        error,
        cart,
        theme,
        addToCart,
        updateQtyCart,
        removeFromCart,
        clearCart,
        setTheme: (t) => { setTheme(t); persistTheme(t); },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}