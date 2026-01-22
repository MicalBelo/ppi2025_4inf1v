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
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) alert(error.message);
    else setPedidos(data);
    setLoading(false);
  }

  async function marcarComoPago(id) {
    const { error } = await supabase
      .from("pedidos")
      .update({ pago: true })
      .eq("id", id);

    if (error) alert("Erro ao atualizar");
    else fetchPedidos(); // Atualiza a lista na tela
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Painel de Controle - InfoShirt</h1>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Turma</th>
            <th>Tamanho</th>
            <th>Comprovante</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.aluno_nome}</td>
              <td>{pedido.aluno_turma}</td>
              <td>{pedido.tamanho}</td>
              <td>
                <a href={pedido.comprovante_url} target="_blank" rel="noreferrer">
                  Ver Foto
                </a>
              </td>
              <td>{pedido.pago ? "✅ Pago" : "⏳ Pendente"}</td>
              <td>
                {!pedido.pago && (
                  <button onClick={() => marcarComoPago(pedido.id)}>
                    Confirmar Pagamento
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}