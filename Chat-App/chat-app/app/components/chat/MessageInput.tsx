"use client";

import type React from "react";
import { useState, useRef, type KeyboardEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Send, Bold, Italic, Smile, Loader2 } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isSending) {
      setIsSending(true);
      try {
        await onSendMessage(message.trim());
        setMessage("");
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const insertFormatting = (format: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selectedText = message.substring(start, end);

    let formattedText = "";
    let cursorOffset = 0;

    switch (format) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`;
        cursorOffset = selectedText ? formattedText.length : start + 2;
        break;
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`;
        cursorOffset = selectedText ? formattedText.length : start + 1;
        break;
      case "link":
        formattedText = `[${selectedText || "link text"}](url)`;
        cursorOffset = selectedText
          ? start + selectedText.length + 3
          : start + 11;
        break;
    }

    const newMessage =
      message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newMessage);

    // Focus back to input and set cursor position
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(cursorOffset, cursorOffset);
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newMessage =
      message.substring(0, start) + emoji + message.substring(end);
    setMessage(newMessage);

    setTimeout(() => {
      input.focus();
      const newCursorPos = start + emoji.length;
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="px-2 bg-transparent"
            onClick={() => insertFormatting("bold")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="px-2 bg-transparent"
            onClick={() => insertFormatting("italic")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="px-2 bg-transparent"
            onClick={() => insertEmoji("😀")}
            title="Emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isSending}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            maxLength={500}
          />
        </div>

        <Button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          className="bg-blue-600 hover:bg-blue-700 px-4"
          title="Send message"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>{message.length}/500 characters</span>
        <span>Press Enter to send</span>
      </div>
    </div>
  );
}
