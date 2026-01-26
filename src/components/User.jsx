import { useContext, useEffect, useState } from "react";
import styles from "./User.module.css";
import { SessionContext } from "../context/SessionContext";
import { Manager } from "./Manager";
import { supabase } from "../utils/supabase";

export function User() {
  const { session, handleSignOut } = useContext(SessionContext);
  const [meusPedidos, setMeusPedidos] = useState([]);

  useEffect(() => {
    async function fetchMeusPedidos() {
      if (!session?.user) return;
      
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("user_id", session.user.id) // Certifique-se que a coluna no banco é user_id
        .order("created_at", { ascending: false });

      if (!error) setMeusPedidos(data);
    }

    fetchMeusPedidos();
  }, [session]);

  if (!session) {
    return (
      <div className={styles.container}>
        <h1>Usuário não logado!</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {session.user.user_metadata.admin ? (
        <>
          <h1>Painel Administrativo</h1>
          <Manager />
        </>
      ) : (
        <>
          <h1>Minha Conta</h1>
          <div className={styles.userInfo}>
            <p><strong>Username:</strong> {session.user.user_metadata.username}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
          </div>

          <hr className={styles.divider} />

          <h2 className={styles.subTitle}>📦 Meus Pedidos</h2>
          <div className={styles.pedidosGrid}>
            {meusPedidos.length > 0 ? (
              meusPedidos.map((p) => (
                <div key={p.id} className={styles.pedidoCard}>
                  <div className={styles.pedidoHeader}>
                    <span>Pedido #{p.id.toString().slice(0, 5)}</span>
                    <span className={p.pago ? styles.pago : styles.pendente}>
                      {p.pago ? "Pagamento Confirmado" : "Aguardando Pagamento"}
                    </span>
                  </div>
                  
                  <h3>{p.produto_nome} - Tam: {p.tamanho}</h3>
                  
                  <div className={styles.statusTimeline}>
                    <p>Status: <strong>{p.status_entrega || "Pendente"}</strong></p>
                    {p.mensagem_retirada && (
                      <div className={styles.msgRetirada}>
                        📍 <strong>Recado:</strong> {p.mensagem_retirada}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Você ainda não realizou pedidos.</p>
            )}
          </div>
        </>
      )}
      <button className={styles.button} onClick={handleSignOut}>
        SAIR DA CONTA
      </button>
    </div>
  );
}