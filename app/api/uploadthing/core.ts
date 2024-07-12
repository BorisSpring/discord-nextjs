import { auth } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const authProfile = () => {
  const { userId } = auth();

  if (!userId) throw new Error('Unathorized!');

  return { userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => authProfile())
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
  messageFile: f(['pdf', 'image'])
    .middleware(async () => authProfile())
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
