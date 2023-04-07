import type { OurFastifyInstance } from '../types.js';
import { serializerCompiler } from './serializer-compiler.js';
import type { ZodTypeProvider } from './types.js';
import { validationCompiler } from './validation-compiler.js';

export function configureValidations(fastify: OurFastifyInstance): OurFastifyInstance {
	// Configure Zod validation
	fastify.setValidatorCompiler(validationCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	return fastify.withTypeProvider<ZodTypeProvider>();
}
