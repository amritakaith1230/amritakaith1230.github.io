"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import type { ChatRoom } from "../../lib/types";
import { Plus, Users, MessageSquare, Hash, Clock, Loader2 } from "lucide-react";
import { formatDate } from "../../lib/utils";

interface RoomListProps {
  rooms: ChatRoom[];
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: (name: string, description?: string) => void;
  currentRoom: string | null;
  isConnected: boolean;
}

export default function RoomList({
  rooms,
  onJoinRoom,
  onCreateRoom,
  currentRoom,
  isConnected,
}: RoomListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && !isCreating) {
      setIsCreating(true);
      try {
        await onCreateRoom(
          newRoomName.trim(),
          newRoomDescription.trim() || undefined
        );
        setNewRoomName("");
        setNewRoomDescription("");
        setIsCreateDialogOpen(false);
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Chat Rooms
              {!isConnected && (
                <Badge variant="destructive" className="text-xs">
                  Offline
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Choose a room to join the conversation
            </CardDescription>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                disabled={!isConnected}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Room
                </DialogTitle>
                <DialogDescription>
                  Create a new chat room for others to join and discuss topics
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name *</Label>
                  <Input
                    id="roomName"
                    placeholder="e.g., Gaming, Movies, Study Group"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                    maxLength={50}
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomDescription">
                    Description (Optional)
                  </Label>
                  <textarea
                    id="roomDescription"
                    placeholder="What's this room about?"
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    maxLength={200}
                    rows={3}
                    disabled={isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isCreating || !newRoomName.trim()}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Room"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="text-center py-12 px-6">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No rooms available
              </h3>
              <p className="text-gray-500 mb-4">
                Create the first room to get started!
              </p>
              {!isConnected && (
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-200"
                >
                  Connecting to server...
                </Badge>
              )}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                    currentRoom === room.id
                      ? "ring-2 ring-blue-500 border-blue-200 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => onJoinRoom(room.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 truncate">
                            {room.name}
                          </h3>
                          {currentRoom === room.id && (
                            <Badge
                              variant="default"
                              className="text-xs bg-blue-600"
                            >
                              Active
                            </Badge>
                          )}
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
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{room.messages.length} messages</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(room.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-gray-100"
                        >
                          <Users className="h-3 w-3" />
                          {room.users.length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
