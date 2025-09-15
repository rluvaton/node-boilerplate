import type { OurFastifyInstance } from '../types.ts'
import { serializerCompiler } from './serializer-compiler.ts'
import type { ZodTypeProvider } from './types.ts'
import { validationCompiler } from './validation-compiler.ts'

export function configureValidations(fastify: OurFastifyInstance): OurFastifyInstance {
  // Configure Zod validation
  fastify.setValidatorCompiler(validationCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  return fastify.withTypeProvider<ZodTypeProvider>()
}
