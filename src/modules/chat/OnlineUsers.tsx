import styles from "./OnlineUsers.module.css";

type Props = {
  onlineUsers: string[];
};

const OnlineUsers = ({ onlineUsers }: Props) => (
  <aside className={styles.usersAside} aria-label="Online users">
    <div className={styles.usersHeader}>Online Users:</div>
    <ul className={styles.usersList}>
      {onlineUsers.map((user) => (
        <li key={user} className={styles.userItem}>
          <span className={styles.userDot} aria-hidden="true" />
          <span className={styles.userName}>{user}</span>
        </li>
      ))}
    </ul>
  </aside>
);

export default OnlineUsers;