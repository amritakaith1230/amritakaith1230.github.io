const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
cors: {
  origin: [
    "http://localhost:3000",
    "https://amritakaith1230-github-io-ne34.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true,
},
  transports: ["websocket", "polling"],
});

// In-memory storage
const rooms = new Map();
const users = new Map();
const userRooms = new Map();

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
];

defaultRooms.forEach((room) => {
  rooms.set(room.id, room);
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const username = socket.handshake.auth.username;
  if (!username) {
    socket.emit("error", "Username is required");
    socket.disconnect();
    return;
  }

  // Create user
  const user = {
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
      users: room.users.map((u) => ({ ...u, socketId: undefined })),
    }));
    socket.emit("rooms_list", roomsList);
  });

  // Join room
  socket.on("join_room", (roomId) => {
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
        messages: room.messages.slice(-50),
        users: room.users.map((u) => ({ ...u, socketId: undefined })),
      });

      // Notify other users in room
      socket.to(roomId).emit("user_joined", {
        user: { ...user, socketId: undefined },
        users: room.users.map((u) => ({ ...u, socketId: undefined })),
      });

      console.log(`User ${username} joined room ${room.name}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "Failed to join room");
    }
  });

  // Leave room
  socket.on("leave_room", (roomId) => {
    leaveRoom(socket, roomId);
  });

  // Send message
  socket.on("send_message", (data) => {
    try {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }

      // Check if user is in the room
      if (!room.users.find((u) => u.id === socket.id)) {
        socket.emit("error", "You are not in this room");
        return;
      }

      const content = data.content.trim();
      if (!content) {
        socket.emit("error", "Message cannot be empty");
        return;
      }

      if (content.length > 500) {
        socket.emit("error", "Message too long");
        return;
      }

      const message = {
        id: Date.now().toString(),
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
  socket.on("create_room", (data) => {
    try {
      if (!data.name || data.name.trim().length < 2) {
        socket.emit("error", "Room name must be at least 2 characters");
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

      const roomId = Date.now().toString();
      const newRoom = {
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
        users: room.users.map((u) => ({ ...u, socketId: undefined })),
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
      leaveRoom(socket, currentRoomId, false);
    }

    // Clean up
    users.delete(socket.id);
    userRooms.delete(socket.id);
  });

  // Helper function to leave room
  function leaveRoom(socket, roomId, emitToSocket = true) {
    const room = rooms.get(roomId);
    if (room) {
      socket.leave(roomId);
      room.users = room.users.filter((u) => u.id !== socket.id);
      userRooms.delete(socket.id);

      // Notify other users in room
      socket.to(roomId).emit("user_left", {
        userId: socket.id,
        users: room.users.map((u) => ({ ...u, socketId: undefined })),
      });

      console.log(`User ${username} left room ${room.name}`);
    }
  }

  // Send initial rooms list
  const roomsList = Array.from(rooms.values()).map((room) => ({
    ...room,
    users: room.users.map((u) => ({ ...u, socketId: undefined })),
  }));
  socket.emit("rooms_list", roomsList);
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
