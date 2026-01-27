import { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export const SessionContext = createContext({});

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const [sessionMessage, setSessionMessage] = useState(null);

  useEffect(() => {
    // Verifica sessão ativa ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função de Login
  async function handleSignIn(email, password) {
    setSessionLoading(true);
    setSessionError(null);
    setSessionMessage(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) setSessionError(error.message);
    setSessionLoading(false);
  }

  // FUNÇÃO QUE ESTAVA FALTANDO:
  async function handleSignUp(email, password, username) {
    setSessionLoading(true);
    setSessionError(null);
    setSessionMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          admin: false,
          sub_admin: false,
        },
      },
    });

    if (error) {
      setSessionError(error.message);
    } else {
      setSessionMessage("Account created! Please check your email for confirmation.");
    }
    setSessionLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        sessionLoading,
        sessionError,
        sessionMessage,
        handleSignIn,
        handleSignUp, // ESSA LINHA É OBRIGATÓRIA
        handleSignOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}