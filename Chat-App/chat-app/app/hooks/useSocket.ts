"use client";

import { useEffect, useState, useCallback } from "react";
import type { Socket } from "socket.io-client";
import SocketManager from "../lib/socket";
import type { Message, User, ChatRoom } from "../lib/types";

export function useSocket(username: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      const socketManager = SocketManager.getInstance();
      const newSocket = socketManager.connect(username);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log("Connected to chat server");
      });

      newSocket.on("disconnect", (reason) => {
        setIsConnected(false);
        console.log("Disconnected from chat server:", reason);
      });

      newSocket.on("connect_error", (error) => {
        setConnectionError("Failed to connect to chat server");
        console.error("Connection error:", error);
      });

      newSocket.on("rooms_list", (roomsList: ChatRoom[]) => {
        setRooms(roomsList);
      });

      newSocket.on(
        "room_joined",
        (data: { roomId: string; messages: Message[]; users: User[] }) => {
          setCurrentRoom(data.roomId);
          setMessages(data.messages);
          setOnlineUsers(data.users);
        }
      );

      newSocket.on("new_message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on("user_joined", (data: { user: User; users: User[] }) => {
        setOnlineUsers(data.users);
      });

      newSocket.on("user_left", (data: { userId: string; users: User[] }) => {
        setOnlineUsers(data.users);
      });

      newSocket.on("error", (error: string) => {
        console.error("Socket error:", error);
      });

      // Request initial rooms list
      newSocket.emit("get_rooms");

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [username]);

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socket && isConnected) {
        socket.emit("join_room", roomId);
      }
    },
    [socket, isConnected]
  );

  const leaveRoom = useCallback(() => {
    if (socket && currentRoom && isConnected) {
      socket.emit("leave_room", currentRoom);
      setCurrentRoom(null);
      setMessages([]);
      setOnlineUsers([]);
    }
  }, [socket, currentRoom, isConnected]);

  const sendMessage = useCallback(
    (content: string) => {
      if (socket && currentRoom && content.trim() && isConnected) {
        socket.emit("send_message", {
          roomId: currentRoom,
          content: content.trim(),
        });
      }
    },
    [socket, currentRoom, isConnected]
  );

  const createRoom = useCallback(
    (name: string, description?: string) => {
      if (socket && isConnected) {
        socket.emit("create_room", {
          name: name.trim(),
          description: description?.trim(),
        });
      }
    },
    [socket, isConnected]
  );

  return {
    socket,
    isConnected,
    connectionError,
    rooms,
    currentRoom,
    messages,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    createRoom,
  };
}
