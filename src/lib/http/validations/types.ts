import type { FastifyTypeProvider } from 'fastify'
import type z from 'zod'
import type { input, output, ZodTypeAny } from 'zod'
import type { $ZodType } from 'zod/v4/core'

export interface ZodTypeProvider extends FastifyTypeProvider {
  validator: this['schema'] extends $ZodType ? output<this['schema']> : unknown
  serializer: this['schema'] extends $ZodType ? input<this['schema']> : unknown
}
