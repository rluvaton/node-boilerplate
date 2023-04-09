import { setupHttpServer, startHttpServer } from './lib/http/server.js';

export async function main(): Promise<void> {
  await setupHttpServer();
  await startHttpServer();
}

try {
  await main();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(`failed to start`, { error: err });
}
