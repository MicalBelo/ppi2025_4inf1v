import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import styles from "./Admin.module.css";

export function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) alert("Erro ao carregar pedidos: " + error.message);
    else setPedidos(data || []);
    setLoading(false);
  }

  // Atualiza se o PIX foi pago ou não
  async function atualizarStatusPagamento(id, statusAtual) {
    const { error } = await supabase
      .from("pedidos")
      .update({ pago: !statusAtual })
      .eq("id", id);

    if (error) alert("Erro ao atualizar pagamento");
    else fetchPedidos(); 
  }

  // NOVA FUNÇÃO: Atualiza o status de logística e recado
  async function atualizarEntrega(id, campo, valor) {
    const { error } = await supabase
      .from("pedidos")
      .update({ [campo]: valor })
      .eq("id", id);

    if (error) console.error("Erro ao atualizar entrega");
    else fetchPedidos();
  }

  if (loading) return <div className={styles.adminContainer}>Carregando painel...</div>;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Logística de Pedidos - InfoShirt</h1>
        <button onClick={fetchPedidos} className={styles.refreshButton}>🔄 Atualizar Lista</button>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Aluno/Turma</th>
              <th>Produto/Tam</th>
              <th>Comprovante</th>
              <th>Pagamento</th>
              <th>Status de Entrega</th>
              <th>Local de Retirada / Recado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>
                  <strong>{pedido.aluno_nome}</strong>
                  <br /><small>{pedido.aluno_turma}</small>
                </td>
                <td>{pedido.produto_nome} <br /><strong>{pedido.tamanho}</strong></td>
                
                <td>
                  {pedido.comprovante_url ? (
                    <div className={styles.thumbContainer}>
                      <img 
                        src={pedido.comprovante_url} 
                        alt="Pix" 
                        className={styles.thumbnail}
                        onClick={() => window.open(pedido.comprovante_url, "_blank")}
                      />
                    </div>
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
                    placeholder="Ex: Bloco A, Sala 3"
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
    </div>
  );
}