import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

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
    <div style={{ maxWidth: 300, margin: "100px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <button type="submit" style={{ width: "100%", padding: 8 }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;