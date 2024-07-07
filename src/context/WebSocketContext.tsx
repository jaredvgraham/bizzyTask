"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

interface WebSocketContextType {
  socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(baseUrl ? baseUrl : "http://localhost:5000", {
      transports: ["websocket"],
    });

    setSocket(socketIo);
    console.log(baseUrl);

    socketIo.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
