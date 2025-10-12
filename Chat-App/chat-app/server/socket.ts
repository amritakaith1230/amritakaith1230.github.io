import type { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Message, ChatRoom, User } from "../app/lib/types";
import {
  generateId,
  sanitizeMessage,
  validateUsername,
  validateRoomName,
} from "../app/lib/utils";

// In-memory storage (use Redis or database in production)
const rooms = new Map<string, ChatRoom>();
const users = new Map<string, User>();
const userRooms = new Map<string, string>(); // socketId -> roomId

// Initialize default rooms
const defaultRooms = [
  {
    id: "general",
    name: "General",
    description: "General discussion for everyone",
    users: [],
    messages: [],
    createdAt: new Date(),
  },
  {
    id: "random",
    name: "Random",
    description: "Random conversations and fun topics",
    users: [],
    messages: [],
    createdAt: new Date(),
  },
  {
    id: "tech",
    name: "Tech Talk",
    description: "Discuss technology, programming, and innovation",
    users: [],
    messages: [],
    createdAt: new Date(),
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Talk about your favorite games",
    users: [],
    messages: [],
    createdAt: new Date(),
  },
];

defaultRooms.forEach((room) => {
  rooms.set(room.id, room as ChatRoom);
});

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin:
       process.env.NODE_ENV === "production"
          ? [process.env.FRONTEND_URL, "https://amritakaith1230-github-io-ne34.vercel.app"]
          : [
              "http://localhost:3000",
              "https://amritakaith1230-github-io-2.onrender.com",
            ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    const username = socket.handshake.auth.username;
    if (!username) {
      socket.emit("error", "Username is required");
      socket.disconnect();
      return;
    }

    const validation = validateUsername(username);
    if (!validation.isValid) {
      socket.emit("error", validation.error);
      socket.disconnect();
      return;
    }

    // Create user
    const user: User = {
      id: socket.id,
      username,
      joinedAt: new Date(),
      socketId: socket.id,
    };
    users.set(socket.id, user);

    // Send initial rooms list
    socket.on("get_rooms", () => {
      const roomsList = Array.from(rooms.values()).map((room) => ({
        ...room,
        users: room.users.map((u: User) => ({ ...u, socketId: undefined })), // Don't send socket IDs to client
      }));
      socket.emit("rooms_list", roomsList);
    });

    // Join room
    socket.on("join_room", (roomId: string) => {
      try {
        const room = rooms.get(roomId);
        if (!room) {
          socket.emit("error", "Room not found");
          return;
        }

        // Leave current room if in one
        const currentRoomId = userRooms.get(socket.id);
        if (currentRoomId) {
          leaveRoom(socket, currentRoomId);
        }

        // Join new room
        socket.join(roomId);
        room.users.push(user);
        userRooms.set(socket.id, roomId);

        // Send room data to user
        socket.emit("room_joined", {
          roomId,
          messages: room.messages.slice(-50), // Send last 50 messages
          users: room.users.map((u: User) => ({ ...u, socketId: undefined })),
        });

        // Notify other users in room
        socket.to(roomId).emit("user_joined", {
          user: { ...user, socketId: undefined },
          users: room.users.map((u: User) => ({ ...u, socketId: undefined })),
        });

        console.log(`User ${username} joined room ${room.name}`);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", "Failed to join room");
      }
    });

    // Leave room
    socket.on("leave_room", (roomId: string) => {
      leaveRoom(socket, roomId);
    });

    // Send message
    socket.on("send_message", (data: { roomId: string; content: string }) => {
      try {
        const room = rooms.get(data.roomId);
        if (!room) {
          socket.emit("error", "Room not found");
          return;
        }

        // Check if user is in the room
        if (!room.users.find((u: User) => u.id === socket.id)) {
          socket.emit("error", "You are not in this room");
          return;
        }

        const content = sanitizeMessage(data.content);
        if (!content.trim()) {
          socket.emit("error", "Message cannot be empty");
          return;
        }

        if (content.length > 500) {
          socket.emit("error", "Message too long");
          return;
        }

        const message: Message = {
          id: generateId(),
          content,
          userId: socket.id,
          username,
          timestamp: new Date(),
          roomId: data.roomId,
        };

        room.messages.push(message);

        // Keep only last 1000 messages per room
        if (room.messages.length > 1000) {
          room.messages = room.messages.slice(-1000);
        }

        // Broadcast message to all users in room
        io.to(data.roomId).emit("new_message", message);

        console.log(
          `Message from ${username} in ${room.name}: ${content.substring(
            0,
            50
          )}...`
        );
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // Create room
    socket.on("create_room", (data: { name: string; description?: string }) => {
      try {
        const validation = validateRoomName(data.name);
        if (!validation.isValid) {
          socket.emit("error", validation.error);
          return;
        }

        // Check if room name already exists
        const existingRoom = Array.from(rooms.values()).find(
          (room) => room.name.toLowerCase() === data.name.toLowerCase()
        );

        if (existingRoom) {
          socket.emit("error", "Room name already exists");
          return;
        }

        const roomId = generateId();
        const newRoom: ChatRoom = {
          id: roomId,
          name: data.name.trim(),
          description: data.description?.trim(),
          users: [],
          messages: [],
          createdAt: new Date(),
        };

        rooms.set(roomId, newRoom);

        // Broadcast updated rooms list to all users
        const roomsList = Array.from(rooms.values()).map((room) => ({
          ...room,
          users: room.users.map((u: User) => ({ ...u, socketId: undefined })),
        }));
        io.emit("rooms_list", roomsList);

        console.log(`Room created: ${newRoom.name} by ${username}`);
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("error", "Failed to create room");
      }
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log(`User disconnected: ${socket.id} (${username}) - ${reason}`);

      // Remove user from current room
      const currentRoomId = userRooms.get(socket.id);
      if (currentRoomId) {
        leaveRoom(socket, currentRoomId, false); // Don't emit to socket since it's disconnected
      }

      // Clean up
      users.delete(socket.id);
      userRooms.delete(socket.id);
    });

    // Helper function to leave room
    function leaveRoom(socket: any, roomId: string, emitToSocket = true) {
      const room = rooms.get(roomId);
      if (room) {
        socket.leave(roomId);
        room.users = room.users.filter((u: User) => u.id !== socket.id);
        userRooms.delete(socket.id);

        // Notify other users in room
        socket.to(roomId).emit("user_left", {
          userId: socket.id,
          users: room.users.map((u: User) => ({ ...u, socketId: undefined })),
        });

        console.log(`User ${username} left room ${room.name}`);
      }
    }

    // Send initial rooms list
    const roomsList = Array.from(rooms.values()).map((room) => ({
      ...room,
      users: room.users.map((u: User) => ({ ...u, socketId: undefined })),
    }));
    socket.emit("rooms_list", roomsList);
  });

  return io;
}
