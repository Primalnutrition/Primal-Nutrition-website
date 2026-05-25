import { Router } from 'express'
import { z } from 'zod'
import { chat as chatRateLimit } from '../../middleware/ratelimit.js'
import { runChat } from '../../services/chatService.js'

const router = Router()

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
})

const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long (max 2000 chars)'),
  history: z.array(MessageSchema).max(20).optional().default([]),
})

/**
 * POST /api/admin/chat
 *
 * Body: { message: string, history?: Array<{role, content}> }
 * Returns: { sql, results, summary, latencyMs }
 *
 * Rate-limited to 20 req/min per user.
 * Auth is enforced by the parent router (requireAuth middleware in server.js).
 */
router.post('/', chatRateLimit, async (req, res, next) => {
  try {
    const parse = ChatRequestSchema.safeParse(req.body)
    if (!parse.success) {
      return res.status(422).json({
        error: 'VALIDATION_ERROR',
        issues: parse.error.issues,
      })
    }

    const { message, history } = parse.data

    const result = await runChat({
      prompt: message,
      history,
      adminUserId: req.user.id,
    })

    return res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
