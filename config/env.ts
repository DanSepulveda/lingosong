import { z } from "zod"

import logger from "@/lib/logger"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  GOOGLE_GENERATIVE_AI_MODEL_ID: z
    .string()
    .default("gemini-3.1-flash-lite-preview"),
  YOUTUBE_API_KEY: z.string(),
  TELEGRAM_TOKEN: z.string(),
  TELEGRAM_CHAT_ID: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  logger.error(
    { errors: z.treeifyError(parsedEnv.error) },
    "Invalid environment variables"
  )
  throw new Error("Invalid environment variables")
}

export const env = parsedEnv.data
