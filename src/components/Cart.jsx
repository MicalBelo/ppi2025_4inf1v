import styles from "./Cart.module.css";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Trash, QrCode } from "lucide-react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";

export function Cart() {
  const { cart, updateQtyCart, removeFromCart, clearCart } = useContext(CartContext);
  const { session } = useContext(SessionContext);
  
  const [nome, setNome] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  async function handleFinalizarPedido(e) {
    e.preventDefault();

    // Verificações de segurança
    if (!session) return alert("Você precisa estar logado para finalizar o pedido!");
    if (!arquivo) return alert("Por favor, anexe o comprovante PIX!");
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    
    setEnviando(true);

    try {
      // 1. Upload da imagem para o Bucket 'comprovantes'
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(fileName, arquivo);

      if (uploadError) throw uploadError;

      // 2. Pegar a URL pública da imagem enviada
      const { data: urlData } = supabase.storage.from('comprovantes').getPublicUrl(fileName);

      // 3. Salvar o registro do Pedido na tabela 'pedidos'
      // IMPORTANTE: os nomes das colunas devem ser idênticos aos do Supabase
      const { error: dbError } = await supabase.from("pedidos").insert({
        aluno_nome: nome,
        aluno_turma: cart[0].turma || "Geral",
        produto_nome: cart[0].title, 
        camisa_id: cart[0].id,
        tamanho: tamanho,
        comprovante_url: urlData.publicUrl,
        valor_total: total,
        user_id: session.user.id,    // Vínculo com o login
        status_entrega: "Pendente",  // Status para o rastreio
        pago: false                  // Status financeiro
      });

      if (dbError) throw dbError;

      // Sucesso: limpa o carrinho e avisa o aluno
      alert("Pedido enviado com sucesso! Agora é só aguardar a validação no seu perfil.");
      clearCart();
      setNome("");
      setTamanho("");
      setArquivo(null);
      
    } catch (err) {
      alert("Erro ao enviar pedido: " + err.message);
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.cart}>
      <h2>Seu Carrinho</h2>
      
      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>O carrinho está vazio.</p>
        </div>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((product) => (
              <li key={product.id} className={styles.cartItem}>
                <img src={product.thumbnail} alt={product.title} />
                
                <div className={styles.productInfo}>
                  <h3>{product.title}</h3>
                  <p>R$ {Number(product.price).toFixed(2)}</p>
                </div>

                <div className={styles.quantityControls}>
                  <button 
                    disabled={product.quantity <= 1}
                    onClick={() => updateQtyCart(product.id, product.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button onClick={() => updateQtyCart(product.id, product.quantity + 1)}>
                    +
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(product.id)} 
                  className={styles.removeButton}
                  title="Remover item"
                >
                  <Trash size={24} />
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.checkoutSection}>
            <div className={styles.totalBox}>
              <h3>Total do Pedido:</h3>
              <span className={styles.totalValue}>R$ {total.toFixed(2)}</span>
            </div>
            
            <div className={styles.pixArea}>
              <h4><QrCode size={20} /> Pagamento via PIX</h4>
              <div className={styles.pixKey}>
                <span>Chave:</span> <strong>financeiro@infoshirt.com</strong>
              </div>
              <p className={styles.obs}>Escaneie o QR Code ou use a chave acima e anexe o comprovante.</p>
            </div>

            <form onSubmit={handleFinalizarPedido} className={styles.checkoutForm}>
              <div className={styles.inputGroup}>
                <label>Nome Completo do Aluno:</label>
                <input 
                  type="text" 
                  placeholder="Ex: João Silva Santos" 
                  required 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Tamanho da Camisa:</label>
                <select required value={tamanho} onChange={(e) => setTamanho(e.target.value)}>
                  <option value="">Selecione o tamanho...</option>
                  <option value="PP">PP</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="XG">XG</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Anexar Comprovante (Imagem):</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required 
                  className={styles.fileInput}
                  onChange={(e) => setArquivo(e.target.files[0])}
                />
              </div>

              <button type="submit" disabled={enviando} className={styles.finishButton}>
                {enviando ? "PROCESSANDO PEDIDO..." : "FINALIZAR E ENVIAR"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}