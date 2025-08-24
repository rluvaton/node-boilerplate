import pino, { LoggerOptions, Logger as UnderlyingLogger } from 'pino'
import config from './config.js'
import context from './context.js'

type MergeFn<LogContext> = (logContext: LogContext | undefined, currentLogMeta: any) => object

export class Logger {
  public static topLevelInstance: Logger = new Logger()
  private readonly underlyingLogger: UnderlyingLogger

  // private as the only way we want to create new logger instances is by using the child function
  private constructor(underlyingLogger?: UnderlyingLogger, logPrefix = '') {
    if (underlyingLogger) {
      this.underlyingLogger = underlyingLogger
      return
    }

    const pinoOptions: LoggerOptions = {}

    if (logPrefix) {
      pinoOptions.msgPrefix = logPrefix + ' '
    }

    if (config.logger.pretty) {
      pinoOptions.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    }
    this.underlyingLogger = pino(pinoOptions)
  }

  public error<LogContext extends Record<string | number | symbol, any> = object>(
    msg: string,
    logContext?: LogContext,
  ) {
    this.underlyingLogger.error(Logger.mergeContextData(logContext, context.getAll()), msg)
  }

  public warn<LogContext extends Record<string | number | symbol, any> = object>(msg: string, logContext?: LogContext) {
    this.underlyingLogger.warn(Logger.mergeContextData(logContext, context.getAll()), msg)
  }

  public info<LogContext extends Record<string | number | symbol, any> = object>(msg: string, logContext?: LogContext) {
    this.underlyingLogger.info(Logger.mergeContextData(logContext, context.getAll()), msg)
  }

  public debug<LogContext extends Record<string | number | symbol, any> = object>(
    msg: string,
    logContext?: LogContext,
  ) {
    this.underlyingLogger.debug(Logger.mergeContextData(logContext, context.getAll()), msg)
  }

  public child(bindings: Record<string, unknown>, logPrefix = ''): Logger {
    return new Logger(
      this.underlyingLogger.child(bindings, {
        msgPrefix: logPrefix,
      }),
    )
  }

  private static mergeContextData<LogContext extends Record<string | number | symbol, any> = object>(
    logContext?: LogContext,
    parentContext?: LogContext,
    mergeFn?: MergeFn<LogContext>,
  ) {
    // Fast path:
    if (!logContext) {
      return parentContext
    }

    if (!parentContext) {
      return logContext
    }

    // Slow path:
    if (mergeFn) {
      return mergeFn(logContext, parentContext)
    }

    return {
      ...parentContext,

      // Log context have higher priority than parent context
      ...logContext,
    }
  }

  public static cloneAndAppendContextData<LogContext extends Record<string | number | symbol, any> = object>(
    logContext?: LogContext,
  ) {
    return Logger.mergeContextData(logContext, { ...(context.getAll<any>() || {}) })
  }
}

export const logger = Logger.topLevelInstance

// This is exported just for convenience - so we don't have to do this when we only want to create child logger:
// import { logger as baseLogger } from '../logger';
// const logger = baseLogger.child({}, 'my function')
export const baseLogger = Logger.topLevelInstance
