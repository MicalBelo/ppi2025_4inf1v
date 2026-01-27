import { useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import styles from "./Admin.module.css";
import { GestaoCamisas } from "./GestaoCamisas";

export function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("pedidos");
  const { session } = useContext(SessionContext);

  const isAdminGeral = session?.user?.user_metadata?.admin;
  const isSubAdm = session?.user?.user_metadata?.sub_admin;
  const minhaTurma = session?.user?.user_metadata?.turma;

  useEffect(() => {
    if (abaAtiva === "pedidos") {
      fetchPedidos();
    }
  }, [abaAtiva]);

  async function fetchPedidos() {
    setLoading(true);
    let query = supabase.from("pedidos").select("*").order("created_at", { ascending: false });

    if (isSubAdm && !isAdminGeral) {
      query = query.eq("aluno_turma", minhaTurma);
    }

    const { data, error } = await query;
    if (error) alert("Erro ao carregar pedidos: " + error.message);
    else setPedidos(data || []);
    setLoading(false);
  }

  async function atualizarStatusPagamento(id, statusAtual) {
    const { error } = await supabase.from("pedidos").update({ pago: !statusAtual }).eq("id", id);
    if (error) alert("Erro ao atualizar pagamento");
    else fetchPedidos(); 
  }

  async function atualizarEntrega(id, campo, valor) {
    const { error } = await supabase.from("pedidos").update({ [campo]: valor }).eq("id", id);
    if (error) console.error("Erro ao atualizar entrega");
    else fetchPedidos();
  }

  if (!session) return <div className={styles.adminContainer}>Carregando sessão...</div>;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Painel de Controle - InfoShirt</h1>
        <div className={styles.tabButtons}>
          <button className={abaAtiva === "pedidos" ? styles.tabActive : styles.tabBtn} onClick={() => setAbaAtiva("pedidos")}>📦 Pedidos</button>
          <button className={abaAtiva === "camisas" ? styles.tabActive : styles.tabBtn} onClick={() => setAbaAtiva("camisas")}>👕 Gerenciar Camisas</button>
          {isAdminGeral && (
            <button className={abaAtiva === "equipe" ? styles.tabActive : styles.tabBtn} onClick={() => setAbaAtiva("equipe")}>👥 Equipe</button>
          )}
        </div>
      </header>

      {abaAtiva === "pedidos" && (
        <div className={styles.tableWrapper}>
          <header className={styles.tableHeader}>
             <h2>Logística de Pedidos {isSubAdm ? `- ${minhaTurma}` : "(Geral)"}</h2>
             <button onClick={fetchPedidos} className={styles.refreshButton}>🔄 Atualizar</button>
          </header>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Aluno/Turma</th>
                <th>Produto/Tam</th>
                <th>Comprovante</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th>Recado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td><strong>{pedido.aluno_nome}</strong><br /><small>{pedido.aluno_turma}</small></td>
                  <td>{pedido.produto_nome} <br /><strong>{pedido.tamanho}</strong></td>
                  <td>
                    {pedido.comprovante_url ? (
                      <img 
                        src={pedido.comprovante_url} 
                        className={styles.thumbnail}
                        onClick={() => window.open(pedido.comprovante_url, "_blank")}
                      />
                    ) : <span className={styles.noPhoto}>Sem foto</span>}
                  </td>
                  <td>
                    <button 
                      onClick={() => atualizarStatusPagamento(pedido.id, pedido.pago)}
                      className={pedido.pago ? styles.btnPago : styles.btnPendente}
                    >
                      {pedido.pago ? "✅ Pago" : "⏳ Confirmar?"}
                    </button>
                  </td>
                  <td>
                    <select 
                      value={pedido.status_entrega || "Pendente"} 
                      onChange={(e) => atualizarEntrega(pedido.id, "status_entrega", e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="Pendente">Aguardando</option>
                      <option value="Producao">Em Produção</option>
                      <option value="Retirada">📦 Disponível</option>
                      <option value="Entregue">🤝 Entregue</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="text"
                      value={pedido.mensagem_retirada || ""}
                      onBlur={(e) => atualizarEntrega(pedido.id, "mensagem_retirada", e.target.value)}
                      className={styles.inputRecado}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {abaAtiva === "camisas" && <GestaoCamisas />}
      
     {abaAtiva === "equipe" && isAdminGeral && (
  <div className={styles.equipeContainer}>
    <h2>👥 Nomear Líderes de Turma</h2>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const email = e.target.email.value.toLowerCase();
      const turma = e.target.turma.value;

      const { error } = await supabase
        .from("equipe_logistica")
        .upsert([{ email, turma, cargo: 'sub_admin' }]); // Upsert atualiza se já existir

      if (error) alert("Erro: " + error.message);
      else {
        alert(`Sucesso! ${email} agora é líder do ${turma}`);
        e.target.reset();
      }
    }}>
      <input name="email" type="email" placeholder="E-mail do Aluno" required />
      <select name="turma" required>
        <option value="">Selecione a Turma</option>
        <option value="1º INFO">1º INFO</option>
        <option value="2º INFO">2º INFO</option>
        <option value="3º INFO">3º INFO</option>
      </select>
      <button type="submit">Dar Poder de Sub-Adm</button>
    </form>
  </div>
)}

    </div>
  );
}