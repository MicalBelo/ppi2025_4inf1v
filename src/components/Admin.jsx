import { useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import styles from "./Admin.module.css";

export function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("pedidos");
  const { session, handleSignOut } = useContext(SessionContext);

  const isAdminGeral = session?.user?.user_metadata?.admin === true;
  const isSubAdm = session?.user?.user_metadata?.sub_admin === true;
  const minhaTurma = session?.user?.user_metadata?.turma;

  useEffect(() => {
    if (session) fetchPedidos();
  }, [session, abaAtiva]);

  async function fetchPedidos() {
    setLoading(true);
    let query = supabase.from("pedidos").select("*").order("created_at", { ascending: false });

    if (isSubAdm && !isAdminGeral && minhaTurma) {
      query = query.eq("aluno_turma", minhaTurma);
    }

    const { data, error } = await query;
    if (error) console.error("Erro:", error.message);
    else setPedidos(data || []);
    setLoading(false);
  }

  async function promoverLider(e) {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase();
    const turma = e.target.turma.value;

    const { error } = await supabase
      .from("equipe_logistica")
      .upsert([{ email, turma, cargo: 'sub_admin' }]);

    if (error) alert("Erro ao promover: " + error.message);
    else {
      alert("Sucesso! O novo líder já pode acessar.");
      e.target.reset();
    }
  }

  if (!session) return <div className={styles.adminContainer}>Carregando...</div>;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Painel InfoShirt</h1>
        <div className={styles.tabButtons}>
          <button 
            onClick={() => setAbaAtiva("pedidos")} 
            className={abaAtiva === "pedidos" ? styles.tabActive : styles.tabBtn}
          >
            📦 Pedidos
          </button>
          {isAdminGeral && (
            <button 
              onClick={() => setAbaAtiva("equipe")} 
              className={abaAtiva === "equipe" ? styles.tabActive : styles.tabBtn}
            >
              👥 Equipe
            </button>
          )}
          <button onClick={handleSignOut} className={styles.btnUndo}>Sair</button>
        </div>
      </header>

      {abaAtiva === "pedidos" && (
        <section className={styles.tableWrapper}>
          <div className={styles.tableHeader}>
             <h2>Pedidos {isAdminGeral ? "(Geral)" : `- Turma ${minhaTurma}`}</h2>
             <button onClick={fetchPedidos} className={styles.refreshButton}>Atualizar</button>
          </div>
          
        <table className={styles.table}>
  <thead>
    <tr>
      <th>Aluno</th>
      <th>Turma</th>
      <th>Comprovante</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {pedidos.length > 0 ? (
      pedidos.map((p) => (
        <tr key={p.id}>
          <td>{p.aluno_nome}</td>
          <td>{p.aluno_turma}</td>
          <td>
            {p.comprovante_url ? (
              <a href={p.comprovante_url} target="_blank" rel="noreferrer" className={styles.btnConfirm} style={{padding: '5px 10px', fontSize: '1.2rem'}}>
                🖼️ Ver Comprovante
              </a>
            ) : <span className={styles.noPhoto}>Sem foto</span>}
          </td>
          <td>
            <span className={p.pago ? styles.badgePago : styles.badgePendente}>
              {p.pago ? "✅ Pago" : "⏳ Pendente"}
            </span>
          </td>
          <td>
            <button 
              className={p.pago ? styles.btnUndo : styles.btnConfirm}
              onClick={async () => {
                const { error } = await supabase
                  .from("pedidos")
                  .update({ pago: !p.pago, status_logistica: !p.pago ? 'Aprovado' : 'Pendente' })
                  .eq("id", p.id);
                
                if (!error) fetchPedidos(); // Atualiza a lista na tela
                else alert("Erro ao atualizar: " + error.message);
              }}
            >
              {p.pago ? "Desmarcar" : "Confirmar"}
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Nenhum pedido encontrado.</td></tr>
    )}
  </tbody>
</table>
        </section>
      )}

      {abaAtiva === "equipe" && isAdminGeral && (
        <section className={styles.tableWrapper} style={{padding: '2rem'}}>
          <h2>Promover Aluno a Líder</h2>
          <form onSubmit={promoverLider} style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <input name="email" type="email" placeholder="E-mail do aluno" required className={styles.inputRecado} />
            <select name="turma" required className={styles.statusSelect}>
              <option value="1º INFO">1º INFO</option>
              <option value="2º INFO">2º INFO</option>
              <option value="3º INFO">3º INFO</option>
            </select>
            <button type="submit" className={styles.btnConfirm}>Confirmar</button>
          </form>
        </section>
      )}
    </div>
  );
}