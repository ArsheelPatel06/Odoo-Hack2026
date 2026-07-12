import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("TransitOps"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().or(z.literal("/api")).default("/api"),
  NEXT_PUBLIC_ENABLE_MOCKS: z.string().optional()
});
