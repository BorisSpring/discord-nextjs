import { ChannelType } from '@prisma/client';
import * as z from 'zod';

export const serverSchema = z.object({
  name: z.string().min(1, 'Server name must have at least one character!'),
  imageUrl: z.string().url('Image is required!'),
});

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, 'Channel name is required!')
    .refine((name) => name.toLowerCase() !== 'general', {
      message: "Channel name must not be 'general'!",
    }),
  type: z.nativeEnum(ChannelType),
});

export const messageSchema = z.object({
  content: z.string().min(1),
});

export const fileSchema = z.object({
  fileUrl: z.string().url({ message: 'File is required!' }),
});
