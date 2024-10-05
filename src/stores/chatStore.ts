import { create } from "zustand";
import { socket } from "@/lib/socket";
import { CHAT_API_URL } from "@/constants";
import { toast } from "sonner";

export type ChatUser = {
  _id?: string;
  userId: string;
  createdAt?: string;
};

interface ChatState {
  initializeChat: (senderId: string, receiverId: string) => Promise<void>;
  receiver: ChatUser | null;
  setReceiver: (receiver: ChatUser) => void;
  sendMessage: (args: { senderId: string; message: string }) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  receiver: null,
  setReceiver: (receiver: ChatUser) => set({ receiver }),

  initializeChat: async (senderId: string, receiverId: string) => {
    try {
      const response = await fetch(`${CHAT_API_URL}/conversation/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId }),
      });

      const responseJson = await response.json();
      const receiver = responseJson?.participants?.find(
        (p: ChatUser) => p.userId !== senderId
      );

      get().setReceiver(receiver || null);
      console.log("Chat initialized", receiver);
    } catch (error) {
      console.error("Failed to initialize chat", error);
    }
  },

  sendMessage: async ({ senderId, message }) => {
    const { receiver } = get();

    if (!message?.trim()) return;

    try {
      const messagePayload = {
        senderId,
        receiverId: receiver?.userId,
        conversationKey: receiver?.userId,
        content: message,
      };

      const newMsg = await fetch(`${CHAT_API_URL}/message/new-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      }).then((res) => res.json());

      if (newMsg.error) {
        console.error(newMsg.error);
        return;
      }

      socket.emit("message", {
        ...newMsg,
        receiver: { userId: receiver?.userId },
      });
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  },
}));
