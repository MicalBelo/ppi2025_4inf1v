import styles from "./Header.module.css";
import img from "./assets/img/deade.jpg";


export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.centralContainer}>
        <div className={styles.containerImg}>
          <img src={img}
          alt="dead"
          />
        </div>
        <h1 className={styles.text}>EU AMO O DEADPOOL</h1>
      </div>
    </header>
  );
}