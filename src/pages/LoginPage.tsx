import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      navigate("/chat");
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.loginSection} aria-label="Login form">
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="text"
            className={styles.input}
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            autoComplete="off"
            required
          />
          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;