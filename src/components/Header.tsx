import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>francisco vieira</h1>
          <p>in love with building things</p>
        </div>
      </div>
    </header>
  );
}
