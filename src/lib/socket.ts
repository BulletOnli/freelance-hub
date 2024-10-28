// "use client";
import { env } from "@/env/client";
import { io } from "socket.io-client";

export const socket = io(env.NEXT_PUBLIC_CHAT_SERVER_URL);
