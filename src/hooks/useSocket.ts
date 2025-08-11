import { useEffect } from "react";
import { socket } from "../services/socket";

export const useSocket = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};