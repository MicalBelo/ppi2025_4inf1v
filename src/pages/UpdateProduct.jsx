import styles from "./UpdateProduct.module.css";

import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom"; // <- importante: react-router-dom
import { InputText } from "../components/InputText";
import { CartContext } from "../service/CartContext";

export function UpdateProduct() {
  const { id } = useParams();
  const { products } = useContext(CartContext);

  const product = useMemo(() => {
    if (!id || !products) return undefined;
    return products.find(p => String(p.id) === String(id));
  }, [id, products]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    thumbnail: "",
    description: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title ?? "",
        price: String(product.price ?? ""),
        thumbnail: product.thumbnail ?? "",
        description: product.description ?? "",
      });
    } else if (!id) {
      setForm({ title: "", price: "", thumbnail: "", description: "" });
    }
  }, [product, id]);

  function onChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const isEditing = Boolean(id);

  return (
    <div className={styles.container}>
      <h1>{isEditing ? "Update Product" : "Insert Product"}</h1>

      {isEditing && !product && (
        <p>Product not found.</p>
      )}

      {(!isEditing || product) && (
        <div className={styles.prodInfo}>
          <InputText
            label="Title"
            placeholder="New title"
            value={form.title}
            onChange={onChange("title")}
          />
          <InputText
            label="Price"
            placeholder="New price"
            value={form.price}
            onChange={onChange("price")}
          />
          <InputText
            label="Thumbnail"
            placeholder="New thumbnail"
            value={form.thumbnail}
            onChange={onChange("thumbnail")}
          />
          <InputText
            label="Description"
            placeholder="New description"
            value={form.description}
            onChange={onChange("description")}
          />

          <button>{isEditing ? "Update product" : "Add product"}</button>
        </div>
      )}
    </div>
  );
}