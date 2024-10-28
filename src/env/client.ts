import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_CHAT_SERVER_URL: z.string().min(1),
    NEXT_PUBLIC_ADMIN_USER_ID: z.string().min(1),
    NEXT_PUBLIC_ADMIN_WALLET_ID: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CHAT_SERVER_URL: process.env.NEXT_PUBLIC_CHAT_SERVER_URL,
    NEXT_PUBLIC_ADMIN_USER_ID: process.env.NEXT_PUBLIC_ADMIN_USER_ID,
    NEXT_PUBLIC_ADMIN_WALLET_ID: process.env.NEXT_PUBLIC_ADMIN_WALLET_ID,
  },
});
