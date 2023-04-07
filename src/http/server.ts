import { randomUUID } from 'node:crypto';

import { fastify as Fastify } from 'fastify';

import { logger } from '../lib/logger.js';
import { OurFastifyInstance } from './types.js';
import { configureValidations } from './validations/index.js';
import * as context from '../lib/context';
import requestIdPlugin, { generateRequestId, REQUEST_ID_HEADER } from './request-id';
import config from '../lib/config';
import { echoApi } from '../echo/api';

let fastify: OurFastifyInstance;

export async function setupHttpServer() {
  if (fastify) {
    await fastify.close();
  }

  fastify = Fastify({
    // Generate Request ID or use the one that already exist
    requestIdHeader: REQUEST_ID_HEADER,
    genReqId: generateRequestId,

    ignoreTrailingSlash: true,
  });
  fastify = configureValidations(fastify);

  // Add the request id and more to the current context
  fastify.addHook('onRequest', (req, _, next) => {
    // This is the first store initialize, so no worry on overriding
    context.run(next, {
      request_id: req.id,
      path: req.url,
      method: req.method,
    });
  });

  fastify.register(requestIdPlugin);

  fastify.register(echoApi, { prefix: '/echo' });

  return fastify;
}

export async function startHttpServer(): Promise<OurFastifyInstance> {
  /* c8 ignore start */
  if (!fastify) {
    throw new Error('you must call setupHttpServer first');
  }
  /* c8 ignore stop */

  // TODO - replace with convict

  const address = await fastify.listen({
    port: config.http.port,
    host: '0.0.0.0',
  });

  logger.info(`Listening on port ${address}`);

  return fastify;
}

export function getFastifyInstance(): OurFastifyInstance {
  /* c8 ignore start */
  if (!fastify) {
    throw new Error('you must call setupHttpServer first');
  }
  /* c8 ignore stop */
  return fastify;
}
