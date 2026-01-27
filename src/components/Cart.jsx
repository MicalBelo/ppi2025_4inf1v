import styles from "./Cart.module.css";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Trash, QrCode, ShoppingBag } from "lucide-react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";

export function Cart() {
  const { cart, updateQtyCart, removeFromCart, clearCart } = useContext(CartContext);
  const { session } = useContext(SessionContext);
  const [nome, setNome] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Função para atualizar o tamanho de um item específico no carrinho
  function handleUpdateTamanho(id, novoTamanho) {
    // Se o seu context não tiver updateTamanho, podemos passar via metadado na quantidade
    // Mas aqui assumimos que o objeto item no cart pode ser atualizado
    updateQtyCart(id, null, novoTamanho); 
  }

  async function handleFinalizarPedido(e) {
    e.preventDefault();
    if (!session) return alert("Faça login!");
    if (cart.length === 0) return alert("Carrinho vazio!");
    
    // Validar se todos os itens têm tamanho selecionado
    const semTamanho = cart.find(item => !item.tamanho);
    if (semTamanho) return alert(`Selecione o tamanho para: ${semTamanho.title}`);
    
    if (!arquivo) return alert("Anexe o comprovante PIX!");
    
    setEnviando(true);
    try {
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { error: upError } = await supabase.storage.from('comprovantes').upload(fileName, arquivo);
      if (upError) throw upError;

      const { data: urlData } = supabase.storage.from('comprovantes').getPublicUrl(fileName);

      // Criar resumo detalhado: "1x Camisa Info (M), 2x Camisa Adm (G)"
      const resumoProdutos = cart.map(item => `${item.quantity}x ${item.title} (${item.tamanho})`).join(", ");

      const { error: dbError } = await supabase.from("pedidos").insert({
        aluno_nome: nome,
        aluno_turma: cart[0].turma,
        produto_nome: resumoProdutos,
        valor_total: total,
        total_itens: totalItens,
        comprovante_url: urlData.publicUrl,
        user_id: session.user.id,
        status_entrega: "Pendente",
        pago: false
      });

      if (dbError) throw dbError;
      alert("Pedido enviado com sucesso!");
      clearCart();
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.cart}>
      <h2><ShoppingBag size={40} /> Seu Carrinho</h2>

      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className={styles.itemsWrapper}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.thumbnail} alt={item.title} />
                
                <div className={styles.productInfo}>
                  <h3>{item.title}</h3>
                  <p>R$ {item.price.toFixed(2)}</p>
                  
                  {/* Seleção de Tamanho Individual */}
                  <select 
                    className={styles.selectTamanho}
                    value={item.tamanho || ""} 
                    onChange={(e) => updateQtyCart(item.id, item.quantity, e.target.value)}
                    required
                  >
                    <option value="">Tam...</option>
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </select>
                </div>

                <div className={styles.quantityControls}>
                  <button onClick={() => updateQtyCart(item.id, item.quantity - 1, item.tamanho)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQtyCart(item.id, item.quantity + 1, item.tamanho)}>+</button>
                </div>

                <button className={styles.removeButton} onClick={() => removeFromCart(item.id)}>
                  <Trash size={25} />
                </button>
              </div>
            ))}
          </div>

          <section className={styles.checkoutSection}>
            <div className={styles.pixArea}>
              <h4><QrCode size={30} /> Pagamento PIX</h4>
              <p>Total: <strong>R$ {total.toFixed(2)}</strong></p>
            </div>

            <form className={styles.checkoutForm} onSubmit={handleFinalizarPedido}>
              <input 
                type="text" 
                placeholder="Nome Completo do Aluno" 
                value={nome} 
                onChange={e => setNome(e.target.value)} 
                required 
              />

              <label>Anexar Comprovante:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setArquivo(e.target.files[0])} 
                required 
              />

              <button type="submit" className={styles.finishButton} disabled={enviando}>
                {enviando ? "Processando..." : `Finalizar Pedido (R$ ${total.toFixed(2)})`}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}