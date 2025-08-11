type Props = {
  onlineUsers: string[];
};

const OnlineUsers = ({ onlineUsers }: Props) => (
  <div style={{ marginBottom: 12, padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
    <strong>Online Users:</strong> {onlineUsers.join(", ")}
  </div>
);

export default OnlineUsers;