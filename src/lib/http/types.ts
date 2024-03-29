import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import { FastifyBaseLogger, FastifyInstance } from 'fastify';

import type { ZodTypeProvider } from './validations/index.js';

export type OurFastifyInstance = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger,
  ZodTypeProvider
>;
