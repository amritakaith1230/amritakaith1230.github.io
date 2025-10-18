"use client";

import { useState, useCallback } from "react";
import type { Message } from "../lib/types";
import { sanitizeMessage } from "../lib/utils";

export function useChat() {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const formatMessage = useCallback((content: string): string => {
    // Basic markdown-like formatting
    const sanitized = sanitizeMessage(content);

    return sanitized
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
      );
  }, []);

  const processMessage = useCallback(
    (message: Message): Message => {
      return {
        ...message,
        content: formatMessage(message.content),
        formatted: true,
      };
    },
    [formatMessage]
  );

  const startTyping = useCallback(() => {
    setIsTyping(true);
  }, []);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
  }, []);

  return {
    isTyping,
    typingUsers,
    formatMessage,
    processMessage,
    startTyping,
    stopTyping,
  };
}
