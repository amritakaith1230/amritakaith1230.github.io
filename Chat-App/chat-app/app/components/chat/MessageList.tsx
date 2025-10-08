"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "../../lib/types";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { formatTime, formatDate } from "../../lib/utils";
import { ChevronDown, Copy } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  roomName?: string;
}

export default function MessageList({
  messages,
  currentUserId,
  roomName,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isNearBottom);
    setAutoScroll(isNearBottom);
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  const formatMessage = (content: string) => {
    // Basic markdown-like formatting with XSS protection
    const formatted = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-medium">$1</a>'
      );

    return formatted;
  };

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

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {roomName ? `Welcome to #${roomName}!` : "No messages yet"}
          </h3>
          <p className="text-gray-600">
            {roomName
              ? "This is the beginning of your conversation in this room."
              : "Be the first to start the conversation!"}
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 relative bg-white">
      <div
        ref={messagesContainerRef}
        className="h-full overflow-y-auto p-4 space-y-1"
        onScroll={handleScroll}
      >
        {Object.entries(messageGroups).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-600">
                  {formatDate(new Date(date))}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message, index) => {
              const isOwnMessage = message.userId === currentUserId;
              const prevMessage = index > 0 ? dayMessages[index - 1] : null;
              const nextMessage =
                index < dayMessages.length - 1 ? dayMessages[index + 1] : null;

              const showAvatar =
                !prevMessage || prevMessage.userId !== message.userId;
              const showUsername = showAvatar;
              const isLastInGroup =
                !nextMessage || nextMessage.userId !== message.userId;

              const timeDiff = prevMessage
                ? new Date(message.timestamp).getTime() -
                  new Date(prevMessage.timestamp).getTime()
                : 0;
              const showTimestamp = showAvatar || timeDiff > 5 * 60 * 1000; // 5 minutes

              return (
                <div
                  key={message.id}
                  className={`group flex gap-3 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors ${
                    isOwnMessage ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex flex-col items-center w-10">
                    {showAvatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`${getAvatarColor(
                            message.userId
                          )} text-white text-xs font-semibold`}
                        >
                          {getInitials(message.username)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 flex items-center justify-center">
                        {showTimestamp && (
                          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatTime(new Date(message.timestamp))}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex flex-col max-w-[70%] ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    {showUsername && (
                      <div
                        className={`flex items-center gap-2 mb-1 ${
                          isOwnMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <span className="text-sm font-semibold text-gray-900">
                          {message.username}
                        </span>
                        {showTimestamp && (
                          <span className="text-xs text-gray-500">
                            {formatTime(new Date(message.timestamp))}
                          </span>
                        )}
                        {isOwnMessage && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="relative group/message">
                      <div
                        className={`rounded-lg px-3 py-2 max-w-full break-words shadow-sm ${
                          isOwnMessage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900 border"
                        } ${isLastInGroup ? "mb-2" : "mb-1"}`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message.content),
                          }}
                          className="text-sm leading-relaxed"
                        />
                      </div>

                      {/* Message actions */}
                      <div
                        className={`absolute top-0 ${
                          isOwnMessage ? "left-0" : "right-0"
                        } transform ${
                          isOwnMessage
                            ? "-translate-x-full"
                            : "translate-x-full"
                        } opacity-0 group-hover/message:opacity-100 transition-opacity`}
                      >
                        <div className="flex gap-1 bg-white border rounded-lg shadow-lg p-1 ml-2 mr-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyMessage(message.content)}
                            title="Copy message"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={() => scrollToBottom()}
            size="sm"
            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
