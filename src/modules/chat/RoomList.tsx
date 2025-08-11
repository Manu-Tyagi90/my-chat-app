type Props = {
  rooms: string[];
  selectedRoom: string;
  onJoinRoom: (room: string) => void;
  onCreateRoom: () => void;
};

const RoomList = ({ rooms, selectedRoom, onJoinRoom, onCreateRoom }: Props) => (
  <div style={{ marginBottom: 12, padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
    <strong>Rooms:</strong>
    {rooms.map((room) => (
      <button
        key={room}
        style={{
          marginLeft: 8,
          fontWeight: selectedRoom === room ? "bold" : "normal",
          background: selectedRoom === room ? "#d0eaff" : "white",
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: "2px 8px",
          cursor: "pointer"
        }}
        onClick={() => onJoinRoom(room)}
      >
        {room}
      </button>
    ))}
    <button
      style={{
        marginLeft: 8,
        background: "#b2f2bb",
        border: "1px solid #ccc",
        borderRadius: 4,
        padding: "2px 8px",
        cursor: "pointer"
      }}
      onClick={onCreateRoom}
    >
      + New Room
    </button>
  </div>
);

export default RoomList;