import styles from "./RoomHeader.module.css";

type Props = {
  selectedRoom: string;
};

const RoomHeader = ({ selectedRoom }: Props) => (
  <header className={styles.roomHeader} aria-label="Current chat room">
    <h2 className={styles.roomTitle}>Room: {selectedRoom}</h2>
  </header>
);

export default RoomHeader;