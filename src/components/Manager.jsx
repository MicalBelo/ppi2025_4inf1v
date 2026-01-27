import { useState, useEffect, useContext } from "react";
import styles from "./Manager.module.css";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";

export function Manager() {
  const { session, sessionLoading } = useContext(SessionContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Adicionado 'description' ao estado inicial
  const [form, setForm] = useState({ 
    id: null, 
    title: "", 
    price: "", 
    thumbnail: "", 
    turma: "", 
    ano: "",
    description: "" 
  });

  const isAdminGeral = session?.user?.user_metadata?.admin;
  const isSubAdm = session?.user?.user_metadata?.sub_admin;
  const minhaTurma = session?.user?.user_metadata?.turma;

  useEffect(() => {
    if (session) fetchProducts();
  }, [session]);

  async function fetchProducts() {
    setLoading(true);
    let query = supabase.from("product_1").select("*");
    if (isSubAdm && !isAdminGeral) query = query.eq("turma", minhaTurma);
    
    const { data, error } = await query.order("title");
    if (!error) setProducts(data || []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // 2. Incluído 'description' no payload enviado ao Supabase
    const payload = {
      title: form.title,
      price: Number(form.price),
      thumbnail: form.thumbnail,
      turma: isAdminGeral ? form.turma : minhaTurma,
      ano: Number(form.ano),
      description: form.description 
    };

    const { error } = form.id 
      ? await supabase.from("product_1").update(payload).eq("id", form.id)
      : await supabase.from("product_1").insert([payload]);

    if (error) {
      alert("Erro: " + error.message);
    } else {
      alert("Sucesso!");
      // 3. Resetando o campo de descrição após o envio
      setForm({ id: null, title: "", price: "", thumbnail: "", turma: "", ano: "", description: "" });
      fetchProducts();
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    const { error } = await supabase.from("product_1").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchProducts();
  }

  if (sessionLoading) return <div className={styles.managerContainer}><p>Carregando...</p></div>;
  if (!isAdminGeral && !isSubAdm) return <div className={styles.managerContainer}><p>Acesso negado.</p></div>;

  return (
    <div className={styles.managerContainer}>
      <div className={styles.managerBox}>
        <h2 className={styles.managerTitle}>
          Gerenciar Camisas {isSubAdm && `(${minhaTurma})`}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.managerActions}>
          <input className={styles.managerInput} placeholder="Título da Camisa" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <input className={styles.managerInput} placeholder="Preço (Ex: 45.90)" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          
          {/* 4. Novo campo de Descrição (usando uma classe que ocupe a largura total se desejar) */}
          <input className={styles.managerInput} placeholder="Descrição (obrigatório)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          
          <input className={styles.managerInput} placeholder="URL da Imagem" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} />
          
          {isAdminGeral && (
            <input className={styles.managerInput} placeholder="Turma (ex: 1º INFO)" value={form.turma} onChange={e => setForm({...form, turma: e.target.value})} />
          )}
          
          <select className={styles.managerInput} value={form.ano} onChange={e => setForm({...form, ano: e.target.value})} required>
            <option value="">Selecione o Ano...</option>
            <option value="1">1º Ano</option>
            <option value="2">2º Ano</option>
            <option value="3">3º Ano</option>
            <option value="4">4º Ano</option>
          </select>
          
          <button type="submit" className={styles.managerButton}>
            {form.id ? "Atualizar Produto" : "Adicionar Produto"}
          </button>
        </form>
      </div>

      <div className={styles.managerList}>
        {loading ? (
          <p>Buscando camisas...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className={styles.managerItem}>
              <div className={styles.productMainInfo}>
                <div className={styles.thumbWrapper}>
                  {product.thumbnail ? (
                    <img src={product.thumbnail} alt={product.title} className={styles.adminThumb} />
                  ) : (
                    <div className={styles.noImg}>Sem foto</div>
                  )}
                </div>
                
                <div className={styles.managerItemInfo}>
                  <strong>{product.title}</strong>
                  <span>R$ {Number(product.price).toFixed(2)}</span>
                  <small>Turma: {product.turma} | {product.ano}º ano</small>
                </div>
              </div>

              <div className={styles.managerItemActions}>
                <button onClick={() => setForm(product)} className={styles.btnEdit}>Editar</button>
                <button onClick={() => handleDelete(product.id)} className={styles.btnDelete}>Excluir</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma camisa cadastrada.</p>
        )}
      </div>
    </div>
  );
}