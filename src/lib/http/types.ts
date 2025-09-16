import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { FastifyBaseLogger, FastifyInstance } from 'fastify'
import type { FastifyLoggerAdapter } from '../logger/fastify-logger-adapter.js'
import type { ZodTypeProvider } from './validations/index.js'

export type OurFastifyInstance = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerAdapter,
  ZodTypeProvider
>
