import React from "react";

type Props = {
  typingUser: string | null;
};

const TypingIndicator = ({ typingUser }: Props) =>
  typingUser ? (
    <div style={{ fontStyle: "italic", color: "#888", marginBottom: 8 }}>
      {typingUser} is typing...
    </div>
  ) : null;

export default TypingIndicator;