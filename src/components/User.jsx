import { useContext, useEffect, useState } from "react";
import styles from "./User.module.css";
import { SessionContext } from "../context/SessionContext";
import { Manager } from "./Manager";
import { Admin } from "./Admin";
import { supabase } from "../utils/supabase";

export function User() {
  const { session, handleSignOut } = useContext(SessionContext);
  const [meusPedidos, setMeusPedidos] = useState([]);

  const isAdmin = session?.user?.user_metadata?.admin;
  const isSubAdm = session?.user?.user_metadata?.sub_admin;

  useEffect(() => {
    async function fetchMeusPedidos() {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error) setMeusPedidos(data || []);
    }
    fetchMeusPedidos();
  }, [session]);

  if (!session) return <div className={styles.container}><h1>Acesse sua conta</h1></div>;

  return (
    <div className={styles.container}>
      {(isAdmin || isSubAdm) ? (
        <div className={styles.adminArea}>
          <h1>Painel de Gestão {isSubAdm && `(Sub-Adm)`}</h1>
          <Admin /> 
          <Manager />
        </div>
      ) : (
        <div className={styles.clientArea}>
          <h1>Minha Conta</h1>
          <div className={styles.userInfo}>
            <p><strong>Username:</strong> {session.user.user_metadata.username}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
          </div>

          <hr className={styles.divider} />

          <h2 className={styles.subTitle}>📦 Meus Pedidos</h2>
          <div className={styles.pedidosGrid}>
            {meusPedidos.map((p) => (
              <div key={p.id} className={styles.pedidoCard}>
                <div className={styles.pedidoHeader}>
                  <span>Pedido #{p.id.toString().slice(-5)}</span>
                  <span className={p.pago ? styles.pago : styles.pendente}>
                    {p.pago ? "Pagamento Confirmado" : "Pendente"}
                  </span>
                </div>
                
                {/* Aqui aparecerá ex: "1x Camisa Info (M), 1x Camisa Adm (P)" */}
                <h3 className={styles.pedidoProdutos}>{p.produto_nome}</h3>
                
                <div className={styles.pedidoFooter}>
                  <p>Itens: {p.total_itens}</p>
                  <p>Total: <strong>R$ {Number(p.valor_total).toFixed(2)}</strong></p>
                </div>

                <div className={styles.statusTimeline}>
                  <p>Status: <strong>{p.status_entrega}</strong></p>
                  {p.mensagem_retirada && (
                    <div className={styles.msgRetirada}>
                      📍 {p.mensagem_retirada}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button className={styles.buttonSignOut} onClick={handleSignOut}>SAIR</button>
    </div>
  );
}