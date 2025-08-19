import styles from "./InputText.module.css";

export function InputText({ label, placeholder, value = "", onChange, type = "text", required }) {
  return (
    <label className={styles.label}>
      {label && <span>{label}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}