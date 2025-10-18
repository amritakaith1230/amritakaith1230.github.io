"use client";

import type { User } from "../../lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Users, Circle, Crown, MoreVertical } from "lucide-react";
import { formatTime } from "../../lib/utils";

interface UserListProps {
  users: User[];
  currentUserId?: string;
  roomName?: string;
}

export default function UserList({
  users,
  currentUserId,
  roomName,
}: UserListProps) {
  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-rose-500",
    ];
    const index = userId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const sortedUsers = [...users].sort((a, b) => {
    // Current user first
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    // Then by username
    return a.username.localeCompare(b.username);
  });

  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-green-600" />
          <span>Online Users</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {users.length}
          </Badge>
        </CardTitle>
        {roomName && <p className="text-sm text-gray-600">in #{roomName}</p>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <h3 className="font-medium text-gray-900 mb-1">
                No users online
              </h3>
              <p className="text-sm text-gray-500">
                Waiting for others to join...
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {sortedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 ${
                    user.id === currentUserId
                      ? "bg-blue-50 border border-blue-200"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={`${getAvatarColor(
                          user.id
                        )} text-white text-sm font-semibold`}
                      >
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <Circle className="h-3 w-3 fill-green-500 text-green-500 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {user.username}
                      </span>
                      {user.id === currentUserId && (
                        <Badge
                          variant="default"
                          className="text-xs bg-blue-600"
                        >
                          You
                        </Badge>
                      )}
                      {index === 0 && user.id !== currentUserId && (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Joined {formatTime(new Date(user.joinedAt))}
                    </p>
                  </div>

                  {user.id !== currentUserId && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
