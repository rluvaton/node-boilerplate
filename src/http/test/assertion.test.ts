import { faker } from '@faker-js/faker';
import HttpStatusCode from 'http-status';
import type { ZodAny } from 'zod';
import { z } from 'zod';

import { setupServerAndModify } from '../../../test/helpers/fastify-helper.js';

describe('request/response assertion', () => {
  it('should return Bad Request when request body does not match the body schema', async () => {
    const route = `/${faker.datatype.uuid()}`;

    const User = z.object({
      id: z.number(),
    });

    type UserType = z.infer<typeof User>;

    const client = await setupServerAndModify((fastify) => {
      fastify.post<{ Body: UserType; Reply: z.infer<ZodAny> }>(
        route,
        {
          schema: {
            body: User,
          },
        },
        (request, reply) => {
          reply.send({});
        },
      );
    });

    const response = await client.axios.post(route, {
      id: 'not a number',
    });

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.data).toMatchObject({ message: 'Validation error: Expected number, received string at "id"' });
  });

  it('should return Server Error when response body does not match the response schema', async () => {
    const routeCalled = vi.fn();
    const route = `/${faker.datatype.uuid()}`;

    const User = z.object({
      name: z.string(),
      mail: z.string().email().optional(),
    });

    type UserType = z.infer<typeof User>;

    const client = await setupServerAndModify((fastify) => {
      fastify.post<{ Body: z.infer<ZodAny>; Reply: UserType }>(
        route,
        {
          schema: {
            response: {
              200: User,
            },
          },
        },
        (request, reply) => {
          routeCalled();

          // @ts-expect-error we don't send the right type on purpose
          reply.send({});
        },
      );
    });

    const response = await client.axios.post(route, {});

    expect(routeCalled).toHaveBeenCalled();

    expect(response.status).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
  });
});
