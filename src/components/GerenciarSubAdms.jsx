import { useState } from "react";
import { supabase } from "../utils/supabase";

export function GerenciarSubAdms() {
  const [email, setEmail] = useState("");
  const [turma, setTurma] = useState("");

  async function handleAddSub(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("equipe_logistica")
      .insert([{ email, turma }]);

    if (error) alert("Erro: " + error.message);
    else {
      alert("Sub-Adm adicionado com sucesso!");
      setEmail("");
      setTurma("");
    }
  }

  return (
    <div style={{ padding: '2rem', background: '#f4f4f4', borderRadius: '8px' }}>
      <h3>Promover Aluno a Sub-Adm</h3>
      <form onSubmit={handleAddSub}>
        <input 
          type="email" 
          placeholder="E-mail do Aluno" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <select value={turma} onChange={(e) => setTurma(e.target.value)} required>
          <option value="">Selecione a Turma</option>
          <option value="1º INFO">1º INFO</option>
          <option value="2º INFO">2º INFO</option>
          <option value="3º INFO">3º INFO</option>
        </select>
        <button type="submit">Dar Permissão</button>
      </form>
    </div>
  );
}