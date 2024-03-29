import { Method } from 'axios';

import { getFastifyInstance, setupHttpServer } from '../../src/lib/http/server.js';
import type { OurFastifyInstance } from '../../src/lib/http/types.js';
import { BaseHttpClient } from './base-http-client.js';

export type SupportedFastifyMethod = Exclude<Lowercase<Method>, 'purge' | 'unlink' | 'link'>;

export async function setupServerAndModify(
  modifyBeforeInit: (fastify: OurFastifyInstance) => unknown | Promise<unknown>,
): Promise<BaseHttpClient> {
  await setupHttpServer();

  // Allowing multiple server creating in this test
  await BaseHttpClient.downIfExists();

  const fastify = getFastifyInstance();

  await modifyBeforeInit(fastify);

  const client = new BaseHttpClient();

  // Not setting up routes as we set up them here and modified them in modifyBeforeInit
  await client.init({ setupRoutes: false });

  return client;
}
