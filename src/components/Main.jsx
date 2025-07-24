import styles from "./Main.module.css";
import img from "./assets/img/wolv.jpg";
export function Main() {
  return (
    <div className={styles.container}>
      <header className={styles.header} />
      <aside className={styles.aside} />
      <div className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.card}>
         <img src="https://picsum.photos/200?random=2"/>
            <h2>Card 1</h2>
            <p>Ele é fofo</p>
          </div>
          <div className={styles.card}>
            <img src="https://picsum.photos/200?random=2"/>
            <h2>Card 2</h2>
            <p>Ele é engraçado</p>
          </div>
          <div className={styles.card}>
            <img src="https://picsum.photos/200?random=3"/>
            <h2>Card 3</h2>
            <p>Ele é romantico</p>
          </div>
          <div className={styles.card}>
            <img src="https://picsum.photos/200?random=4"/>
            <h2>Card 4</h2>
            <p>Ele é meio agressivo</p>
          </div>
          <div className={styles.card}>
            <img src="https://picsum.photos/200?random=5"/>
            <h2>Card 5</h2>
            <p>Mas tambem pode ser muito amoroso</p>
          </div>
        </div>
      </div>
      <footer className={styles.footer} />
    </div>
  );
}