import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().optional(),
    DATABASE_URL: z.string().min(1),
    UPLOADTHING_SECRET: z.string(),
    UPLOADTHING_APP_ID: z.string(),
    WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_CHAT_SERVER_URL: z.string().min(1),
    NEXT_PUBLIC_ADMIN_USER_ID: z.string().min(1),
    NEXT_PUBLIC_ADMIN_WALLET_ID: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CHAT_SERVER_URL: process.env.NEXT_PUBLIC_CHAT_SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    NEXT_PUBLIC_ADMIN_USER_ID: process.env.NEXT_PUBLIC_ADMIN_USER_ID,
    NEXT_PUBLIC_ADMIN_WALLET_ID: process.env.NEXT_PUBLIC_ADMIN_WALLET_ID,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  },
});
