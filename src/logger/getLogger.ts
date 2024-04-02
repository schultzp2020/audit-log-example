import * as winston from 'winston'

import { LOG_LEVELS } from './constants'

const defaultFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat()
)

const auditLogFormat = winston.format((info, opts) => {
  const { isAuditLog, ...newInfo } = info

  if (isAuditLog) {
    return opts.isAuditLog ? newInfo : false
  }

  return !opts.isAuditLog ? newInfo : false
})

const transports = {
  console: [
    new winston.transports.Console({
      format: winston.format.combine(
        auditLogFormat({ isAuditLog: false }),
        winston.format.colorize(),
        defaultFormat,
        winston.format.simple()
      )
    })
  ],
  log: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.combine(
        auditLogFormat({ isAuditLog: false }),
        defaultFormat,
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.combine(
        auditLogFormat({ isAuditLog: false }),
        defaultFormat,
        winston.format.json()
      )
    })
  ],
  auditLog: [
    new winston.transports.File({
      filename: 'audit-log-error.log',
      level: 'error',
      format: winston.format.combine(
        auditLogFormat({ isAuditLog: true }),
        defaultFormat,
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'audit-log-combined.log',
      format: winston.format.combine(
        auditLogFormat({ isAuditLog: true }),
        defaultFormat,
        winston.format.json()
      )
    })
  ]
}

const logger = winston.createLogger({
  level: 'info',
  levels: LOG_LEVELS,
  format: winston.format.combine(defaultFormat, winston.format.json()),
  defaultMeta: { service: 'backstage' },
  transports: [...transports.console, ...transports.log, ...transports.auditLog]
})

export function getLogger() {
  return logger
}
