import type { FastifyBaseLogger } from 'fastify'
import type { Bindings, ChildLoggerOptions } from 'fastify/types/logger'
import type { LevelWithSilentOrString, LogFn, LoggerOptions } from 'pino'
import { Logger, type LoggerLogFn } from './index.js'

export class FastifyLoggerAdapter implements FastifyBaseLogger {
  #inner: Logger

  private constructor(inner: Logger) {
    this.#inner = inner
  }

  public static default(options: LoggerOptions = {}): FastifyLoggerAdapter {
    // Default info
    return new FastifyLoggerAdapter(Logger.topLevelInstanceWithOptions(options))
  }

  child(bindings: Bindings, options?: ChildLoggerOptions): FastifyLoggerAdapter {
    // only msgPrefix option is supported at the moment
    return new FastifyLoggerAdapter(this.#inner.child(bindings, options?.msgPrefix, options))
  }

  #createLogFn(logFn: LoggerLogFn): LogFn {
    return (obj, ...args) => {
      let message = ''

      if (args.length === 0) {
        message = obj as string
        // @ts-ignore: fix this
        obj = undefined
      } else {
        message = args.shift() as string
      }

      if (typeof obj === 'string' && typeof message === 'string') {
        throw new Error('I dont think we can get 2 strings')
      }

      let stringMessage: string
      let objAsObject: Record<string | number | symbol, any> | undefined

      if (typeof obj === 'string') {
        stringMessage = obj
        objAsObject = undefined
      } else if (typeof message === 'string') {
        stringMessage = message
        objAsObject =
          typeof obj === 'object' && obj
            ? obj
            : {
                data: obj,
              }
      } else {
        const error = new Error('both obj and message are not a string')
        this.#inner.error(error.message, {
          message,
          obj,
          error,
        })
        throw error
      }

      if (args.length > 0) {
        const error = new Error('args were provided but they are not supported')
        this.#inner.error(error.message, {
          message,
          obj,
          args,
          error,
        })

        throw error
      }

      logFn(stringMessage, objAsObject)
    }
  }

  // Currently we default to info
  level: LevelWithSilentOrString = 'info'

  // We don't support fatal at the moment
  fatal: LogFn = this.#createLogFn((message, obj) => this.#inner.error(message, obj))

  error: LogFn = this.#createLogFn((message, obj) => this.#inner.error(message, obj))
  warn: LogFn = this.#createLogFn((message, obj) => this.#inner.warn(message, obj))
  info: LogFn = this.#createLogFn((message, obj) => this.#inner.info(message, obj))
  debug: LogFn = this.#createLogFn((message, obj) => this.#inner.debug(message, obj))
  // trace is not supported yet
  trace: LogFn = this.#createLogFn((message, obj) => this.#inner.debug(message, obj))
  silent: LogFn = this.#createLogFn((_message, _obj) => {
    // Noop
  })

  get msgPrefix(): string | undefined {
    return this.#inner.logPrefix()
  }
}
