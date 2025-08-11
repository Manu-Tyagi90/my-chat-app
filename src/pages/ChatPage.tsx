import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ChatPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={logout}>Logout</button>
      {/* Chat UI will go here */}
    </div>
  );
}

export default ChatPage;