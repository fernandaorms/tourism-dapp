import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/auth';

const f = createUploadthing();

export const uploadRouter = {
    pointImage: f({ image: { maxFileSize: '1MB' } })
        .middleware(async () => {
            const session = await auth();
            if (!session?.user) throw new Error('Não autenticado');
            if (session.user.role !== 'ADMIN') throw new Error('Acesso negado');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { userId: (session.user as any).id };
        })
        .onUploadComplete(async ({ file }) => {
            return { imageUrl: file.ufsUrl, key: file.key };
        }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
