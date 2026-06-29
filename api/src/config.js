import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  PORT: z.string().default('8080'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase — optional so local dev boots without keys
  SUPABASE_URL: z.string().optional().default(''),
  SUPABASE_SERVICE_KEY: z.string().optional().default(''),
  SUPABASE_ANON_KEY: z.string().optional().default(''),

  // Postgres direct connection (for seed script)
  DATABASE_URL: z.string().optional().default(''),

  // Groq
  GROQ_API_KEY: z.string().optional().default(''),

  // Resend (transactional email)
  RESEND_API_KEY: z.string().optional().default(''),
  RESEND_FROM_EMAIL: z.string().optional().default(''),

  // Meta Conversions API (server-side Purchase events)
  META_PIXEL_ID: z.string().optional().default('991258953663271'),
  META_CAPI_ACCESS_TOKEN: z.string().optional().default(''),
  META_CAPI_TEST_EVENT_CODE: z.string().optional().default(''),
  META_CAPI_API_VERSION: z.string().optional().default('v21.0'),

  // Admin OTP/JWT
  ADMIN_JWT_SECRET: z.string().optional().default(''),

  // Cron (daily followup emails)
  CRON_SECRET: z.string().optional().default(''),

  // Razorpay (Phase C)
  RAZORPAY_KEY_ID: z.string().optional().default(''),
  RAZORPAY_KEY_SECRET: z.string().optional().default(''),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(''),

  // Shiprocket (Phase C)
  SHIPROCKET_EMAIL: z.string().optional().default(''),
  SHIPROCKET_PASSWORD: z.string().optional().default(''),
  SHIPROCKET_PICKUP_PINCODE: z.string().optional().default(''),
  SHIPROCKET_PICKUP_LOCATION: z.string().optional().default('Primary'),

  // CORS
  ALLOWED_ORIGINS: z
    .string()
    .default(
      'https://primalnutrition.in,https://www.primalnutrition.in,https://primal-revamp-v2.netlify.app,https://primal-admin.netlify.app,http://localhost:5002,http://localhost:5173'
    ),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:')
  console.error(parsed.error.format())
  process.exit(1)
}

export const config = {
  port: parseInt(parsed.data.PORT, 10),
  nodeEnv: parsed.data.NODE_ENV,
  isDev: parsed.data.NODE_ENV === 'development',
  isProd: parsed.data.NODE_ENV === 'production',

  supabase: {
    url: parsed.data.SUPABASE_URL,
    serviceKey: parsed.data.SUPABASE_SERVICE_KEY,
    anonKey: parsed.data.SUPABASE_ANON_KEY,
    configured: Boolean(parsed.data.SUPABASE_URL && parsed.data.SUPABASE_SERVICE_KEY),
  },

  databaseUrl: parsed.data.DATABASE_URL,
  groqApiKey: parsed.data.GROQ_API_KEY,

  resend: {
    apiKey: parsed.data.RESEND_API_KEY,
    fromEmail: parsed.data.RESEND_FROM_EMAIL,
    configured: Boolean(parsed.data.RESEND_API_KEY && parsed.data.RESEND_FROM_EMAIL),
  },

  meta: {
    pixelId: parsed.data.META_PIXEL_ID,
    accessToken: parsed.data.META_CAPI_ACCESS_TOKEN,
    testEventCode: parsed.data.META_CAPI_TEST_EVENT_CODE,
    apiVersion: parsed.data.META_CAPI_API_VERSION,
    configured: Boolean(parsed.data.META_CAPI_ACCESS_TOKEN && parsed.data.META_PIXEL_ID),
  },

  adminJwtSecret: parsed.data.ADMIN_JWT_SECRET,

  cronSecret: parsed.data.CRON_SECRET,

  razorpay: {
    keyId: parsed.data.RAZORPAY_KEY_ID,
    keySecret: parsed.data.RAZORPAY_KEY_SECRET,
    webhookSecret: parsed.data.RAZORPAY_WEBHOOK_SECRET,
  },

  shiprocket: {
    email: parsed.data.SHIPROCKET_EMAIL,
    password: parsed.data.SHIPROCKET_PASSWORD,
    pickupPincode: parsed.data.SHIPROCKET_PICKUP_PINCODE,
    pickupLocation: parsed.data.SHIPROCKET_PICKUP_LOCATION,
  },

  allowedOrigins: parsed.data.ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
}
