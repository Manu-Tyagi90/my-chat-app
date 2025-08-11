import styles from "./RoomList.module.css";

type Props = {
  rooms: string[];
  selectedRoom: string;
  onJoinRoom: (room: string) => void;
  onCreateRoom: () => void;
};

const RoomList = ({ rooms, selectedRoom, onJoinRoom, onCreateRoom }: Props) => (
  <nav className={styles.roomNav} aria-label="Chat rooms">
    <ul className={styles.roomList}>
      {rooms.map((room) => (
        <li key={room}>
          <button
            className={
              room === selectedRoom
                ? `${styles.roomBtn} ${styles.selected}`
                : styles.roomBtn
            }
            aria-current={room === selectedRoom ? "page" : undefined}
            onClick={() => onJoinRoom(room)}
            type="button"
          >
            {room}
          </button>
        </li>
      ))}
      <li>
        <button
          className={styles.createBtn}
          onClick={onCreateRoom}
          type="button"
          aria-label="Create new room"
        >
          + New Room
        </button>
      </li>
    </ul>
  </nav>
);

export default RoomList;