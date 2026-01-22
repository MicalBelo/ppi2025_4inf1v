import styles from "./Cart.module.css";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Trash, QrCode } from "lucide-react";
import { supabase } from "../utils/supabase";

export function Cart() {
  const { cart, updateQtyCart, removeFromCart, clearCart } = useContext(CartContext);
  
  const [nome, setNome] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  async function handleFinalizarPedido(e) {
    e.preventDefault();
    if (!arquivo) return alert("Por favor, anexe o comprovante PIX!");
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    
    setEnviando(true);
    try {
      // 1. Upload da imagem
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(fileName, arquivo);

      if (uploadError) throw uploadError;

      // 2. URL pública
      const { data: urlData } = supabase.storage.from('comprovantes').getPublicUrl(fileName);

      // 3. Salvar Pedido
      const { error: dbError } = await supabase.from("pedidos").insert({
        aluno_nome: nome,
        aluno_turma: cart[0].turma || "Não informada",
        camisa_id: cart[0].id,
        tamanho: tamanho,
        comprovante_url: urlData.publicUrl,
        valor_total: total
      });

      if (dbError) throw dbError;

      alert("Pedido enviado com sucesso! O administrador irá validar seu pagamento.");
      clearCart();
      setNome("");
      setTamanho("");
      setArquivo(null);
      
    } catch (err) {
      alert("Erro ao enviar pedido: " + err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.cart}>
      <h2>Seu Carrinho</h2>
      
      {cart.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <>
          <ul style={{ width: '100%' }}>
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
                >
                  <Trash size={30} />
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.checkoutSection}>
            <h3>Total do Pedido: R$ {total.toFixed(2)}</h3>
            
            <div className={styles.pixArea}>
              <h4><QrCode size={24} /> Pagamento via PIX</h4>
              <p>Chave: <strong>seu-pix@ifmacau.edu.br</strong></p>
              <p className={styles.obs}>Para Cartão: Procure o líder do seu ano.</p>
            </div>

            <form onSubmit={handleFinalizarPedido} className={styles.checkoutForm}>
              <label>Seus Dados:</label>
              <input 
                type="text" 
                placeholder="Nome Completo do Aluno" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              
              <select required value={tamanho} onChange={(e) => setTamanho(e.target.value)}>
                <option value="">Escolha seu Tamanho</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
              </select>

              <label>Comprovante do PIX:</label>
              <input 
                type="file" 
                accept="image/*" 
                required 
                onChange={(e) => setArquivo(e.target.files[0])}
              />

              <button type="submit" disabled={enviando} className={styles.finishButton}>
                {enviando ? "PROCESSANDO..." : "FINALIZAR E ENVIAR COMPROVANTE"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}