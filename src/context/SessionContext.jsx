import { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export const SessionContext = createContext({});

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const [sessionMessage, setSessionMessage] = useState(null);

  async function enrichSession(currentSession) {
    if (!currentSession?.user) return null;
    try {
      const { data: equipe } = await supabase
        .from("equipe_logistica")
        .select("turma, cargo")
        .eq("email", currentSession.user.email)
        .maybeSingle();

      if (equipe) {
        return {
          ...currentSession,
          user: {
            ...currentSession.user,
            user_metadata: {
              ...currentSession.user.user_metadata,
              sub_admin: true,
              turma: equipe.turma
            }
          }
        };
      }
    } catch (err) {
      console.error("Erro ao enriquecer sessão:", err);
    }
    return currentSession;
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const fullSession = await enrichSession(data?.session);
      setSession(fullSession);
      setSessionLoading(false);
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setSessionMessage(null);
        setSessionError(null);
      } else if (s) {
        const fullSession = await enrichSession(s);
        setSession(fullSession);
      }
      setSessionLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // --- FUNÇÕES DE LOGIN E CADASTRO ---

  async function handleSignIn(email, password) {
    setSessionLoading(true);
    setSessionError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSessionMessage("Login realizado com sucesso!");
    } catch (error) {
      setSessionError(error.message);
    } finally {
      setSessionLoading(false);
    }
  }

  async function handleSignUp(email, password, username) {
    setSessionLoading(true);
    setSessionError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, admin: false },
        },
      });
      if (error) throw error;
      setSessionMessage("Cadastro realizado! Verifique seu e-mail.");
    } catch (error) {
      setSessionError(error.message);
    } finally {
      setSessionLoading(false);
    }
  }

  async function handleSignOut() {
  try {
    await supabase.auth.signOut();
    setSession(null);
    // Limpa tudo para garantir que o navegador não tente voltar sozinho
    localStorage.clear();
    sessionStorage.clear();
    // Redireciona para a tela de login
    window.location.href = "/signin"; 
  } catch (error) {
    console.error("Erro ao sair:", error);
    window.location.href = "/signin";
  }
}

  return (
    <SessionContext.Provider 
      value={{ 
        session, 
        sessionLoading, 
        sessionError, 
        sessionMessage, 
        handleSignIn, 
        handleSignUp, 
        handleSignOut 
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}