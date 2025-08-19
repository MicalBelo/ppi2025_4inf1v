import { useState } from "react";
import styles from "./SignUp.module.css";

import { Link } from "react-router-dom";
import { InputText } from "../components/InputText";

export function SignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className={styles.container}>
      <h1>Sign up</h1>
      <form className={styles.loginCard}>
        <InputText
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange("firstName")}
          required
        />
        <InputText
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange("lastName")}
          required
        />
        <InputText
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
        />
        <label className={styles.dateLabel}>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            required
          />
        </label>
        <InputText
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          required
        />
        <InputText
          placeholder="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          required
        />
        <button className={styles.loginButton}>
          Sign up
        </button>
        <div className={styles.signup}>
          <p>Already have an account?</p>
          <Link to="/login" className={styles.link}>
            <p>Login</p>
          </Link>
        </div>
      </form>
    </div>
  );
}