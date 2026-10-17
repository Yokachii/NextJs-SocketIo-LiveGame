import { createContext, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useRouter } from "next/router";

type WebSocketContextType = {
  socket: Socket | null;
  connectedRoomId: string | null;
};

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connectedRoomId: null,
});

export const WebSocketComponent = () => {
  const router = useRouter();
  const roomId = Array.isArray(router.query.roomid)
    ? router.query.roomid[0]
    : router.query.roomid ?? null;
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    if (roomId) {
      socket.emit("set-room", roomId);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  return (
    <WebSocketContext.Provider
      value={{
        socket: socketRef.current,
        connectedRoomId: roomId,
      }}
    >
      {null}
    </WebSocketContext.Provider>
  );
};