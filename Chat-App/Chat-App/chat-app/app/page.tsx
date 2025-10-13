"use client";

import { useAuth } from "./hooks/useAuth";
import { useSocket } from "./hooks/useSocket";
import LoginForm from "./components/auth/LoginForm";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import {
  LogOut,
  Wifi,
  WifiOff,
  MessageCircle,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: authLoading,
  } = useAuth();
  const { isConnected, rooms, connectionError } = useSocket(
    user?.username || null
  );

  const handleJoinRoom = (roomId: string) => {
    router.push(`/chat/${roomId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Welcome back, {user.username}!
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Choose a room to start chatting
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isConnected ? "default" : "destructive"}
                    className={`flex items-center gap-1 ${
                      isConnected
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    {isConnected ? (
                      <Wifi className="h-3 w-3" />
                    ) : (
                      <WifiOff className="h-3 w-3" />
                    )}
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Users className="h-3 w-3" />
                    {rooms.reduce(
                      (total, room) => total + room.users.length,
                      0
                    )}{" "}
                    online
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="hover:bg-red-50 hover:border-red-200 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Connection Error Alert */}
        {connectionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {connectionError}. Some features may not work properly.
            </AlertDescription>
          </Alert>
        )}

        {/* Room List */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Chat Rooms
                {!isConnected && (
                  <Badge variant="destructive" className="text-xs">
                    Offline
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No rooms available
                  </h3>
                  <p className="text-gray-500 mb-4">Connecting to server...</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      onClick={() => handleJoinRoom(room.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 truncate">
                                #{room.name}
                              </h3>
                            </div>
                            {room.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {room.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{room.users.length} online</span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-gray-100"
                          >
                            <Users className="h-3 w-3" />
                            {room.users.length}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Built with Next.js, Socket.IO, and ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
