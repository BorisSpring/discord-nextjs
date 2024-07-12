import * as z from 'zod';
export const serverSchema = z.object({
  name: z.string().min(1, 'Server name must have at least one character!'),
  imageUrl: z.string().url('Image is required!'),
});
