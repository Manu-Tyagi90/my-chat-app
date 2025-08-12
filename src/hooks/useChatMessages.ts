import { useState, useCallback } from "react";
import type { Message } from "../types/message";

let notificationSound: HTMLAudioElement | null = null;

if (typeof window !== "undefined") {
  notificationSound = new Audio("/notification.mp3");
}

const playNotificationSound = () => {
  if (!notificationSound) return;
  
  notificationSound.currentTime = 0;
  notificationSound.play().catch(() => {});
};

const showBrowserNotification = (message: Message, room: string) => {
  if (
    "Notification" in window &&
    Notification.permission === "granted" &&
    document.visibilityState !== "visible"
  ) {
    new Notification(
      `${message.username} in ${room}`,
      {
        body: message.content,
        icon: "/chat-icon.svg"
      }
    );
    playNotificationSound();
  }
};

const checkMessageExists = (messages: Message[], newMessage: Message): boolean => {
  return messages.some(
    (msg) =>
      msg.username === newMessage.username &&
      msg.timestamp === newMessage.timestamp &&
      msg.content === newMessage.content
  );
};

export function useChatMessages(currentUsername?: string) {
  const [roomMessages, setRoomMessages] = useState<{ [room: string]: Message[] }>({});

  const addMessage = useCallback((room: string, message: Message) => {
    setRoomMessages(prev => {
      const roomMsgs = prev[room] || [];
      
      if (checkMessageExists(roomMsgs, message)) {
        return prev;
      }

      // Show notification if message is from another user
      if (message.username !== currentUsername) {
        showBrowserNotification(message, room);
      }

      return {
        ...prev,
        [room]: [...roomMsgs, message]
      };
    });
  }, [currentUsername]);

  const setRoomHistory = useCallback((room: string, messages: Message[]) => {
    setRoomMessages(prev => ({ ...prev, [room]: messages }));
  }, []);

  const updateSeenStatus = useCallback((room: string, seenBy: string) => {
    setRoomMessages(prev => {
      const roomMsgs = prev[room];
      if (!roomMsgs) return prev;

      return {
        ...prev,
        [room]: roomMsgs.map(msg =>
          !msg.seenBy?.includes(seenBy)
            ? { ...msg, seenBy: [...(msg.seenBy || []), seenBy] }
            : msg
        )
      };
    });
  }, []);

  return {
    roomMessages,
    addMessage,
    setRoomHistory,
    updateSeenStatus
  };
}