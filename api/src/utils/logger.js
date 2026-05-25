import pino from 'pino'
import { config } from '../config.js'

export const logger = pino({
  level: config.isDev ? 'debug' : 'info',
  ...(config.isDev
    ? {}
    : {
        formatters: {
          level(label) {
            return { level: label }
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      }),
})
