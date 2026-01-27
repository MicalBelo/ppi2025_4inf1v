import { useState, useEffect, useContext } from "react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";

export function GestaoCamisas() {
  const { session } = useContext(SessionContext);
  const [camisas, setCamisas] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [thumb, setThumb] = useState(""); // Representa a coluna thumbnail

  const isAdminGeral = session?.user?.user_metadata?.admin;
  const minhaTurma = session?.user?.user_metadata?.turma;

  useEffect(() => {
    fetchCamisas();
  }, []);

  async function fetchCamisas() {
    let query = supabase.from("camisas").select("*");
    if (!isAdminGeral) query = query.eq("turma", minhaTurma);
    const { data } = await query;
    setCamisas(data || []);
  }

  async function handleAdd(e) {
    e.preventDefault();
    const { error } = await supabase.from("camisas").insert([{
      nome,
      preco: parseFloat(preco),
      thumbnail: thumb, // Nome da coluna corrigido
      turma: minhaTurma
    }]);

    if (error) alert("Erro: " + error.message);
    else {
      alert("Camisa adicionada com sucesso!");
      setNome(""); setPreco(""); setThumb("");
      fetchCamisas();
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Cadastrar Camisa para {minhaTurma}</h3>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="Preço" type="number" value={preco} onChange={e => setPreco(e.target.value)} required />
        <input placeholder="Link da Foto (Thumbnail)" value={thumb} onChange={e => setThumb(e.target.value)} />
        <button type="submit">Adicionar</button>
      </form>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        {camisas.map(c => (
          <div key={c.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <img src={c.thumbnail} alt={c.nome} style={{ width: '100px' }} />
            <h4>{c.nome}</h4>
            <p>R$ {c.preco}</p>
          </div>
        ))}
      </div>
    </div>
  );
}