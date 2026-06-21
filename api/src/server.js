import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import pinoHttp from 'pino-http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { config } from './config.js'
import { logger } from './utils/logger.js'
import { general as generalRateLimit } from './middleware/ratelimit.js'
import { adminAuth } from './middleware/adminAuth.js'
import { errorHandler, notFoundHandler } from './middleware/error.js'

// Routes
import productsRouter from './routes/products.js'
import checkoutRouter from './routes/checkout.js'
import webhooksRouter from './routes/webhooks.js'
import authRouter from './routes/auth.js'
import cronRouter from './routes/cron.js'
import subscribeRouter from './routes/subscribe.js'
import adminCustomersRouter from './routes/admin/customers.js'
import adminOrdersRouter from './routes/admin/orders.js'
import adminAnalyticsRouter from './routes/admin/analytics.js'
import adminChatRouter from './routes/admin/chat.js'

// ─── Package version for health endpoint ──────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'))

// ─── App bootstrap ─────────────────────────────────────────────────────────────
const app = express()

// Render serves the app behind a single proxy. Trust it so req.ip and
// express-rate-limit resolve the real client IP from X-Forwarded-For
// (otherwise express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR).
app.set('trust proxy', 1)

// Security headers
app.use(helmet())

// CORS — allow configured origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and configured origins
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// Raw body capture for Razorpay webhook signature verification
app.use(
  express.json({
    verify: (req, _res, buf) => {
      // Store raw body buffer — used by webhooks/razorpay for HMAC verification
      req.rawBody = buf
    },
    limit: '1mb',
  })
)

// HTTP request logging
app.use(
  pinoHttp({
    logger,
    customLogLevel: (_req, res) => (res.statusCode >= 500 ? 'error' : 'info'),
    serializers: {
      req(req) {
        return { method: req.method, url: req.url }
      },
    },
  })
)

// General rate limit on all routes
app.use(generalRateLimit)

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: pkg.version,
    uptime: Math.floor(process.uptime()),
    supabaseConfigured: config.supabase.configured,
  })
})

// ─── Public storefront routes ──────────────────────────────────────────────────
app.use('/api/products', productsRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/webhooks', webhooksRouter)
app.use('/api/subscribe', subscribeRouter)

// ─── Admin OTP login (public — issues session tokens) ─────────────────────────
app.use('/auth', authRouter)

// ─── Daily followup-email cron (Bearer ${CRON_SECRET}) ────────────────────────
app.use('/cron', cronRouter)

// ─── Admin routes — all require Bearer auth (OTP JWT or Supabase) ─────────────
app.use('/api/admin', adminAuth)
app.use('/api/admin/customers', adminCustomersRouter)
app.use('/api/admin/orders', adminOrdersRouter)
app.use('/api/admin/analytics', adminAnalyticsRouter)
app.use('/api/admin/chat', adminChatRouter)

// ─── 404 + error handlers — MUST be last ──────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

// ─── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  logger.info(
    {
      port: config.port,
      env: config.nodeEnv,
      supabase: config.supabase.configured ? 'configured' : 'NOT configured (dev mode)',
    },
    `Primal API v${pkg.version} listening`
  )
})

// ─── Graceful shutdown ─────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — closing HTTP server')
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
})

export default app
