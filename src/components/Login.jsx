import styles from "./Login.module.css";
import { useState, useContext, useEffect } from "react";
import { SessionContext } from "../context/SessionContext";
import { Field } from "@base-ui-components/react/field";
import { Form } from "@base-ui-components/react/form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";

export function Login({ value }) {
  const {
    handleSignIn,
    handleSignUp, // Agora ela virá corretamente do contexto
    session,
    sessionLoading,
    sessionMessage,
    sessionError,
  } = useContext(SessionContext);

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState(value || "signin");
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  // Redireciona se já estiver logado
  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  // Atualiza o modo (Login/Register) via Props
  useEffect(() => {
    if (value) setMode(value);
  }, [value]);

  // Gerenciador de Toasts (Sucesso/Erro)
  useEffect(() => {
    const toastConfig = {
      position: "top-center",
      autoClose: 5000,
      theme: localStorage.getItem("theme") || "light",
      transition: Bounce,
      style: { fontSize: "1.4rem" },
    };

    if (sessionMessage) {
      toast.success(sessionMessage, toastConfig);
    }
    if (sessionError) {
      sessionError === "Email not confirmed" 
        ? toast.info("Please confirm your email before logging in.", toastConfig)
        : toast.error(sessionError, toastConfig);
    }
  }, [sessionMessage, sessionError]);

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    // Validação básica
    if (!formValues.email) newErrors.email = "Email is required";
    if (!formValues.password) newErrors.password = "Password is required";
    
    if (mode === "register") {
      if (!formValues.username) newErrors.username = "Username is required";
      if (formValues.password !== formValues.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Chamada das funções do contexto
    if (mode === "signin") {
      handleSignIn(formValues.email, formValues.password);
    } else {
      handleSignUp(formValues.email, formValues.password, formValues.username);
    }

    // Limpa campos apenas se necessário (opcional)
    if (!sessionError) {
        setShowPassword(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className={styles.container}>
      <h1>{mode === "signin" ? "Sign In" : "Register"}</h1>
      
      <Form className={styles.form} errors={errors} onClearErrors={setErrors} onSubmit={handleSubmit}>
        
        <Field.Root name="email" className={styles.field}>
          <Field.Label className={styles.label}>Email</Field.Label>
          <Field.Control
            type="email"
            name="email"
            required
            value={formValues.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className={styles.input}
          />
          <Field.Error className={styles.error} />
        </Field.Root>

        {mode === "register" && (
          <Field.Root name="username" className={styles.field}>
            <Field.Label className={styles.label}>Username</Field.Label>
            <Field.Control
              type="text"
              name="username"
              required
              value={formValues.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className={styles.input}
            />
            <Field.Error className={styles.error} />
          </Field.Root>
        )}

        <Field.Root name="password" className={styles.field}>
          <Field.Label className={styles.label}>Password</Field.Label>
          <div className={styles.inputWrapper}>
            <Field.Control
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formValues.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <Field.Error className={styles.error} />
        </Field.Root>

        {mode === "register" && (
          <Field.Root name="confirmPassword" className={styles.field}>
            <Field.Label className={styles.label}>Confirm Password</Field.Label>
            <div className={styles.inputWrapper}>
              <Field.Control
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={styles.input}
              />
            </div>
            <Field.Error className={styles.error} />
          </Field.Root>
        )}

        <button type="submit" className={styles.button} disabled={sessionLoading}>
          {sessionLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : mode === "signin" ? "Sign In" : "Register"}
        </button>
      </Form>

      <button onClick={() => setMode(mode === "signin" ? "register" : "signin")} className={styles.info}>
        {mode === "signin" ? "Don't have an account? Click here!" : "Already have an account? Click here!"}
      </button>
    </div>
  );
}