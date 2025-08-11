import React from "react";

type Props = {
  selectedRoom: string;
};

const RoomHeader = ({ selectedRoom }: Props) => (
  <div style={{ marginBottom: 8 }}>
    <strong>Room: {selectedRoom}</strong>
  </div>
);

export default RoomHeader;