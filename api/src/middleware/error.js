import { logger } from '../utils/logger.js'

/**
 * Global JSON error handler — must be mounted last in Express.
 * Translates errors into consistent { error, message, ...(dev: stack) } shape.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.statusCode ?? err.status ?? 500
  const code = err.code ?? 'INTERNAL_ERROR'
  const message = err.message ?? 'An unexpected error occurred'

  if (status >= 500) {
    logger.error({ err, req: { method: req.method, url: req.url } }, 'Unhandled error')
  }

  const body = { error: code, message }

  // Only include stack in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    body.stack = err.stack
  }

  res.status(status).json(body)
}

/**
 * 404 handler — mount before errorHandler.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: `Cannot ${req.method} ${req.path}` })
}

/**
 * Helper to create a structured HTTP error.
 * @param {string} message
 * @param {number} statusCode
 * @param {string} code
 */
export function createError(message, statusCode = 500, code = 'INTERNAL_ERROR') {
  const err = new Error(message)
  err.statusCode = statusCode
  err.code = code
  return err
}
