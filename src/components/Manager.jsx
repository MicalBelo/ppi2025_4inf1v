import { useState, useEffect, useContext } from "react";
import styles from "./Manager.module.css";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";

export function Manager() {
  const { session } = useContext(SessionContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ 
    id: null, title: "", price: "", thumbnail: "", description: "", turma: "", data_limite: "", ano: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("product_1").select("*").order("title");
      if (error) setError(error.message);
      else setProducts(data || []);
      setLoading(false);
    }
    if (session?.user?.user_metadata?.admin) load();
  }, [session]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validação atualizada para incluir os novos campos
    if (!form.title || form.price === "" || !form.turma || !form.data_limite || !form.ano) {
      alert("Por favor, preencha Nome, Preço, Turma (ex: 1inf1m), Ano e Data Limite.");
      return;
    }

    const payload = { 
      title: form.title, 
      price: Number(form.price), 
      thumbnail: form.thumbnail, 
      description: form.description,
      turma: form.turma,          // Texto (ex: 1inf1m)
      ano: Number(form.ano),      // Número (convertido para o Supabase)
      data_limite: form.data_limite 
    };

    try {
      if (editing) {
        const { error } = await supabase.from("product_1").update(payload).eq("id", form.id);
        if (error) throw error;
        setProducts(products.map(p => p.id === form.id ? { ...p, ...payload } : p));
        setEditing(false);
      } else {
        const { data, error } = await supabase.from("product_1").insert([payload]).select().single();
        if (error) throw error;
        setProducts([...products, data]);
      }
      // Reseta o formulário
      setForm({ id: null, title: "", price: "", thumbnail: "", description: "", turma: "", data_limite: "", ano: "" });
    } catch (err) {
      setError(err.message);
      alert("Erro ao salvar: " + err.message);
    }
  }

  function handleEdit(product) {
    setForm({ 
      id: product.id, 
      title: product.title, 
      price: product.price, 
      thumbnail: product.thumbnail, 
      description: product.description,
      turma: product.turma || "",
      ano: product.ano || "",
      data_limite: product.data_limite || ""
    });
    setEditing(true);
  }

  async function handleRemove(id) {
    if(!confirm("Deseja excluir este produto?")) return;
    const { error } = await supabase.from("product_1").delete().eq("id", id);
    if (!error) setProducts(products.filter(p => p.id !== id));
  }

  if (!session?.user?.user_metadata?.admin) return <p>Acesso negado.</p>;

  return (
    <div className={styles.managerContainer}>
      <div className={styles.managerBox}>
        <h2 className={styles.managerTitle}>Gerenciar Produtos</h2>
        <form onSubmit={handleSubmit} className={styles.managerActions}>
          <div className={styles.inputGroup}>
            <label>Nome da Camisa</label>
            <input name="title" value={form.title} onChange={handleChange} className={styles.managerInput} required placeholder="Ex: Camisa Secundária" />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Preço</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className={styles.managerInput} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Código da Turma</label>
            <input name="turma" value={form.turma} onChange={handleChange} className={styles.managerInput} required placeholder="Ex: 1inf1m" />
          </div>

          <div className={styles.inputGroup}>
            <label>Ano Escolar</label>
            <select name="ano" value={form.ano} onChange={handleChange} className={styles.managerInput} required>
              <option value="">Selecione...</option>
              <option value="1">1º Ano</option>
              <option value="2">2º Ano</option>
              <option value="3">3º Ano</option>
              <option value="4">4º Ano</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Data Limite</label>
            <input name="data_limite" type="date" value={form.data_limite} onChange={handleChange} className={styles.managerInput} required />
          </div>

          <div className={styles.inputGroupFull}>
            <label>URL Imagem</label>
            <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className={styles.managerInput} />
          </div>

          <button type="submit" className={styles.managerButton}>{editing ? "Salvar Alterações" : "Adicionar Produto"}</button>
        </form>

        <ul className={styles.managerList}>
          {products.map(p => (
            <li key={p.id} className={styles.managerItem}>
              <div className={styles.managerItemInfo}>
                <strong>{p.title}</strong>
                <div>{p.ano}º Ano - {p.turma}</div>
                <div className={styles.dateLabel}>Limite: {p.data_limite}</div>
              </div>
              <div className={styles.managerItemActions}>
                <button onClick={() => handleEdit(p)} className={styles.managerButtonEdit}>Editar</button>
                <button onClick={() => handleRemove(p.id)} className={styles.managerButtonDelete}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}