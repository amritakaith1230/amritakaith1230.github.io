"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import ChatRoom from "../../components/chat/ChatRoom";
import LoginForm from "../../components/auth/LoginForm";
import { Card, CardContent } from "../../components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";

interface ChatPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { user, isAuthenticated, login, isLoading: authLoading } = useAuth();
  const {
    isConnected,
    rooms,
    currentRoom,
    messages,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    connectionError,
  } = useSocket(user?.username || null);

  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const currentRoomData = rooms.find(
    (room: any) => room.id === resolvedParams.roomId
  );

  useEffect(() => {
    if (isAuthenticated && user && isConnected && !currentRoom && !isJoining) {
      setIsJoining(true);
      setJoinError(null);

      // Check if room exists
      if (
        rooms.length > 0 &&
        !rooms.find((room: any) => room.id === resolvedParams.roomId)
      ) {
        setJoinError("Room not found");
        setIsJoining(false);
        return;
      }

      joinRoom(resolvedParams.roomId);

      // Set timeout for join attempt
      const timeout = setTimeout(() => {
        if (!currentRoom) {
          setJoinError("Failed to join room. Please try again.");
          setIsJoining(false);
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [
    isAuthenticated,
    user,
    isConnected,
    currentRoom,
    resolvedParams.roomId,
    rooms,
    joinRoom,
    isJoining,
  ]);

  useEffect(() => {
    if (currentRoom === resolvedParams.roomId) {
      setIsJoining(false);
      setJoinError(null);
    }
  }, [currentRoom, resolvedParams.roomId]);

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} />;
  }

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Error
            </h2>
            <p className="text-gray-600 text-center mb-4">{connectionError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (joinError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Join Room
            </h2>
            <p className="text-gray-600 text-center mb-4">{joinError}</p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Rooms
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isJoining || !currentRoom || currentRoom !== resolvedParams.roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Joining Room
            </h2>
            <p className="text-gray-600 text-center">
              {currentRoomData
                ? `Connecting to #${currentRoomData.name}...`
                : "Please wait..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentRoomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Room data not found. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ChatRoom
      roomId={currentRoomData.id}
      roomName={currentRoomData.name}
      roomDescription={currentRoomData.description}
      messages={messages}
      users={onlineUsers}
      currentUserId={user.id}
      onSendMessage={sendMessage}
      onLeaveRoom={handleLeaveRoom}
      isConnected={isConnected}
    />
  );
}
