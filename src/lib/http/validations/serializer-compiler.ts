import type { FastifySerializerCompiler } from 'fastify/types/schema.js';
import type { ZodAny } from 'zod';

import { ResponseValidationError } from './error.js';

function resolveSchema(maybeSchema: ZodAny | { properties: ZodAny }): Pick<ZodAny, 'safeParse'> {
  if (maybeSchema.hasOwnProperty('safeParse')) {
    return maybeSchema as ZodAny;
  }

  if (maybeSchema.hasOwnProperty('properties')) {
    return (maybeSchema as { properties: ZodAny }).properties;
  }

  throw new Error(`Invalid schema passed: ${JSON.stringify(maybeSchema)}`);
}

export const serializerCompiler: FastifySerializerCompiler<ZodAny | { properties: ZodAny }> = ({
  schema: maybeSchema,
}) => {
  const schema: Pick<ZodAny, 'safeParse'> = resolveSchema(maybeSchema);

  return (data) => {
    const result = schema.safeParse(data);
    if (result.success) {
      return JSON.stringify(result.data);
    }

    throw new ResponseValidationError(result);
  };
};
