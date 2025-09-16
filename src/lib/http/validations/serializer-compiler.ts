import type { FastifySerializerCompiler } from 'fastify/types/schema.js'
import type { ZodAny } from 'zod'

import { ResponseValidationError } from './error.js'

export function resolveSchema(maybeSchema: ZodAny | { properties: ZodAny }): Pick<ZodAny, 'safeParse' | 'parse'> {
  if (maybeSchema.hasOwnProperty('safeParse') && maybeSchema.hasOwnProperty('parse')) {
    return maybeSchema as ZodAny
  }

  if (maybeSchema.hasOwnProperty('properties')) {
    return resolveSchema((maybeSchema as { properties: ZodAny }).properties)
  }

  throw new Error(`Invalid schema passed: ${JSON.stringify(maybeSchema)}`)
}

export const serializerCompiler: FastifySerializerCompiler<ZodAny | { properties: ZodAny }> = ({
  schema: maybeSchema,
}) => {
  const schema: Pick<ZodAny, 'safeParse'> = resolveSchema(maybeSchema)

  return (data) => {
    const result = schema.safeParse(data)
    if (result.success) {
      return JSON.stringify(result.data)
    }

    throw new ResponseValidationError(result)
  }
}
