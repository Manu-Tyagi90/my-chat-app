import { Stack, Button } from "@mui/material";

type Props = Readonly<{
  rooms: string[];
  selectedRoom: string;
  onJoinRoom: (room: string) => void;
  onCreateRoom: () => void;
}>;

export default function RoomList({
  rooms,
  selectedRoom,
  onJoinRoom,
  onCreateRoom
}: Props) {
  return (
    <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
      {rooms.map((room) => (
        <Button
          key={room}
          variant={room === selectedRoom ? "contained" : "outlined"}
          color={room === selectedRoom ? "primary" : "inherit"}
          onClick={() => onJoinRoom(room)}
          size="small"
          sx={{ textTransform: "none" }}
        >
          {room}
        </Button>
      ))}
      <Button
        variant="contained"
        color="secondary"
        onClick={onCreateRoom}
        size="small"
        sx={{ textTransform: "none" }}
      >
        + New Room
      </Button>
    </Stack>
  );
}