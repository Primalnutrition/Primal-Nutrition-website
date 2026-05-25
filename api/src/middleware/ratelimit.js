import rateLimit from 'express-rate-limit'

/**
 * General rate limiter — 100 requests per minute per IP.
 * Applied to all routes.
 */
export const general = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'RATE_LIMIT', message: 'Too many requests — please slow down' },
})

/**
 * Chat rate limiter — 20 requests per minute keyed on authenticated user ID or IP.
 * Applied only to POST /api/admin/chat.
 */
export const chat = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? req.ip,
  message: { error: 'RATE_LIMIT', message: 'Chat rate limit exceeded — max 20 queries per minute' },
})
