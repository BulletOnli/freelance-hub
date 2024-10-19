import { env } from "@/env";

export const MINIMUM_GIG_PRICE = 50;

export const ADMIN_USER_ID = env.NEXT_PUBLIC_ADMIN_USER_ID;
export const ADMIN_WALLET_ID = env.NEXT_PUBLIC_ADMIN_WALLET_ID;

export const TAX_RATE = 0.05; // 5%
export const CHAT_API_URL = `${env.NEXT_PUBLIC_CHAT_SERVER_URL}/api`;
