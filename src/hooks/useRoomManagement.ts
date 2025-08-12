import { useState, useRef, useEffect } from "react";

export function useRoomManagement(
  joinRoom: (room: string) => void,
  leaveRoom: (room: string) => void
) {
  const [selectedRoom, setSelectedRoom] = useState<string>("General");
  const prevRoomRef = useRef<string | null>(null);

  // Handle room switching
  useEffect(() => {
    if (prevRoomRef.current !== selectedRoom) {
      if (prevRoomRef.current) {
        leaveRoom(prevRoomRef.current);
      }
      joinRoom(selectedRoom);
      prevRoomRef.current = selectedRoom;
    }
  }, [selectedRoom, joinRoom, leaveRoom]);

  const handleJoinRoom = (room: string) => {
    setSelectedRoom(room);
  };

  return {
    selectedRoom,
    handleJoinRoom
  };
}