import { useState } from "react";
import styles from "./Login.module.css";

import { InputText } from "../components/InputText";
import { Link } from "react-router-dom"; // corrigido para react-router-dom

export function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form className={styles.loginCard}>
        <InputText
          placeholder="User"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
        />
        <InputText
          placeholder="Password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          required
        />
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
        <div className={styles.signup}>
          <p>New here?</p>
          <Link to="/signup" className={styles.link}>
            <p>Sign up</p>
          </Link>
        </div>
      </form>
    </div>
  );
}