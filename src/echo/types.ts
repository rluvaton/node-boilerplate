import z from 'zod';

export const PostExampleRequestBody = z.object({
  name: z.string(),
  quote: z.string().optional().default('N/A'),
});
export const PostExampleResponseBody = z.object({
  type: z.literal('post'),
  body: PostExampleRequestBody,
});

export type PostExampleRequestType = z.infer<typeof PostExampleRequestBody>;
export type PostExampleRequestInputType = z.input<typeof PostExampleRequestBody>;
export type PostExampleResponseType = z.infer<typeof PostExampleResponseBody>;
