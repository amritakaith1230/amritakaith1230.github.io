import { type NextRequest, NextResponse } from "next/server";
import { validateRoomName, generateId } from "../../lib/utils";
import { ChatRoom } from "../../lib/types";

// In-memory room storage (use database in production)
const rooms = new Map<string, ChatRoom>();

// Initialize default rooms
if (rooms.size === 0) {
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
}

export async function GET() {
  try {
    const roomsList = Array.from(rooms.values()).map((room) => ({
      ...room,
      userCount: room.users.length,
      messageCount: room.messages.length,
    }));

    return NextResponse.json({
      rooms: roomsList,
      total: roomsList.length,
    });
  } catch (error) {
    console.error("Rooms GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, isPrivate = false } = await request.json();

    const validation = validateRoomName(name);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if room name already exists
    const existingRoom = Array.from(rooms.values()).find(
      (room) => room.name.toLowerCase() === name.toLowerCase()
    );

    if (existingRoom) {
      return NextResponse.json(
        { error: "Room name already exists" },
        { status: 409 }
      );
    }

    const roomId = generateId();
    const newRoom: ChatRoom = {
      id: roomId,
      name: name.trim(),
      description: description?.trim(),
      users: [],
      messages: [],
      createdAt: new Date(),
      isPrivate,
    };

    rooms.set(roomId, newRoom);

    return NextResponse.json({
      success: true,
      room: newRoom,
      message: "Room created successfully",
    });
  } catch (error) {
    console.error("Rooms POST error:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("id");

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    if (!rooms.has(roomId)) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Don't allow deletion of default rooms
    const defaultRooms = ["general", "random", "tech"];
    if (defaultRooms.includes(roomId)) {
      return NextResponse.json(
        { error: "Cannot delete default rooms" },
        { status: 403 }
      );
    }

    rooms.delete(roomId);

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Rooms DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
