import HttpStatusCode from 'http-status';
import { expect } from 'vitest';
import { EchoHttpClient } from './test/echo-http-client';

describe('Response format', () => {
  let searchHttpClient: EchoHttpClient;

  beforeEach(async () => {
    searchHttpClient = await new EchoHttpClient().init();
  });

  describe('POST /examples', () => {
    it('should return under body.quote "N/A" when not passing quote', async () => {
      const response = await searchHttpClient.example({
        name: 'hello world',
      });

      expect(response).toMatchObject({
        status: HttpStatusCode.OK,
        data: {
          type: 'post',
          body: {
            name: 'hello world',
            quote: 'N/A',
          },
        },
      });
    });
  });
});
