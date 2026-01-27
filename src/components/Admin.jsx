import { useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import styles from "./Admin.module.css";

export function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("pedidos");
  const { session, handleSignOut, sessionLoading } = useContext(SessionContext);

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
    if (!error) setPedidos(data || []);
    setLoading(false);
  }

  // NOVA FUNÇÃO: Atualiza qualquer campo do pedido (status, mensagem ou pagamento)
  async function updatePedido(id, updates) {
    const { error } = await supabase
      .from("pedidos")
      .update(updates)
      .eq("id", id);
    
    if (error) alert("Erro ao atualizar: " + error.message);
    else fetchPedidos();
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Painel InfoShirt</h1>
        <div className={styles.tabButtons}>
          <button onClick={() => setAbaAtiva("pedidos")} className={abaAtiva === "pedidos" ? styles.tabActive : styles.tabBtn}>📦 Pedidos</button>
          {isAdminGeral && (
            <button onClick={() => setAbaAtiva("equipe")} className={abaAtiva === "equipe" ? styles.tabActive : styles.tabBtn}>👥 Equipe</button>
          )}
          <button onClick={handleSignOut} className={styles.btnUndo}>Sair</button>
        </div>
      </header>

      {abaAtiva === "pedidos" && (
        <section className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Aluno/Turma</th>
                <th>Produtos</th>
                <th>Pagamento</th>
                <th>Status Logístico</th>
                <th>Recado ao Aluno</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.aluno_nome}</strong><br/><small>{p.aluno_turma}</small></td>
                  <td>{p.produto_nome}</td>
                  
                  {/* Toggle de Pagamento */}
                  <td>
                    <button 
                      className={p.pago ? styles.badgePago : styles.badgePendente}
                      onClick={() => updatePedido(p.id, { pago: !p.pago })}
                    >
                      {p.pago ? "✅ Pago" : "⏳ Pendente"}
                    </button>
                  </td>

                  {/* NOVO: Select de Status Logístico */}
                  <td>
                    <select 
                      value={p.status_entrega || "Pendente"}
                      className={styles.statusSelect}
                      onChange={(e) => updatePedido(p.id, { status_entrega: e.target.value })}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Produção">Em Produção</option>
                      <option value="À Caminho">À Caminho</option>
                      <option value="Pronto para Retirada">Pronto para Retirada</option>
                      <option value="Entregue">Entregue</option>
                    </select>
                  </td>

                  {/* NOVO: Input de Mensagem/Recado */}
                  <td>
                    <div className={styles.messageBox}>
                      <input 
                        type="text" 
                        placeholder="Ex: Pegar no pátio"
                        defaultValue={p.mensagem_retirada || ""}
                        onBlur={(e) => updatePedido(p.id, { mensagem_retirada: e.target.value })}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {/* ... (parte da equipe continua igual) */}
    </div>
  );
}