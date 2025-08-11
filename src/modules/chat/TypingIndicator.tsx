import styles from "./TypingIndicator.module.css";

type Props = {
  typingUser: string | null;
};

const TypingIndicator = ({ typingUser }: Props) =>
  typingUser ? (
    <div className={styles.typingIndicator} role="status" aria-live="polite">
      {typingUser} is typing...
    </div>
  ) : null;

export default TypingIndicator;