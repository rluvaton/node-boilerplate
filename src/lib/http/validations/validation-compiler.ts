import type { FastifySchemaCompiler } from 'fastify';
import type { FastifyValidationResult } from 'fastify/types/schema.js';
import type { ZodAny } from 'zod';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const zodErrorName = new ZodError([]).name;

export const validationCompiler: FastifySchemaCompiler<ZodAny> = ({ schema }): FastifyValidationResult => {
	return (data): any => {
		try {
			return { value: schema.parse(data) };
		} catch (error) {
			if ((error as Error).name !== zodErrorName) {
				return { error };
			}

			const humanReadableValidationError = fromZodError(error as ZodError);

			return { error: new Error(humanReadableValidationError.message) };
		}
	};
};
