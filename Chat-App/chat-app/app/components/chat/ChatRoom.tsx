"use client";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserList from "./UserList";
import type { Message, User } from "../../lib/types";
import { ArrowLeft, Hash, Wifi, WifiOff, Users, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  roomDescription?: string;
  messages: Message[];
  users: User[];
  currentUserId?: string;
  onSendMessage: (message: string) => void;
  onLeaveRoom: () => void;
  isConnected: boolean;
}

export default function ChatRoom({
  roomId,
  roomName,
  roomDescription,
  messages,
  users,
  currentUserId,
  onSendMessage,
  onLeaveRoom,
  isConnected,
}: ChatRoomProps) {
  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col m-4 shadow-lg">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onLeaveRoom}
                className="lg:hidden bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-xl">{roomName}</CardTitle>
                  {roomDescription && (
                    <p className="text-sm text-gray-600 mt-1">
                      {roomDescription}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isConnected ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {isConnected ? (
                    <Wifi className="h-3 w-3" />
                  ) : (
                    <WifiOff className="h-3 w-3" />
                  )}
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {users.length}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onLeaveRoom}
                className="hidden lg:flex bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Leave Room
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Room Settings</DropdownMenuItem>
                  <DropdownMenuItem>Notification Settings</DropdownMenuItem>
                  <DropdownMenuItem>Export Chat</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              roomName={roomName}
            />
            <MessageInput
              onSendMessage={onSendMessage}
              disabled={!isConnected}
              placeholder={`Message #${roomName}...`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Users Sidebar */}
      <div className="w-full lg:w-80 lg:mr-4 lg:mt-4 lg:mb-4">
        <UserList
          users={users}
          currentUserId={currentUserId}
          roomName={roomName}
        />
      </div>
    </div>
  );
}
