import pino from 'pino'

/**
 * Structured logger using pino
 * Configured for production with pretty printing in development
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
  // In production, pino outputs JSON which is better for log aggregation
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
})
