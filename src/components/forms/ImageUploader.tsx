'use client';

import { UploadButton } from '@uploadthing/react';
import type { UploadRouter } from '@/app/api/uploadthing/core';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Props = {
    value?: string; // URL atual (para mostrar preview)
    onChange: (url: string | undefined, meta?: { key?: string }) => void;
};

export function ImageUploader({ value, onChange }: Props) {
    const [uploading, setUploading] = useState(false);

    return (
        <div className='grid gap-3'>
            {value ? (
                <div className='flex items-center gap-3'>
                    <div className='relative h-24 w-32 overflow-hidden rounded-md border bg-muted'>
                        <Image
                            src={value}
                            alt='Pré-visualização'
                            fill
                            className='object-cover'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => onChange(undefined)}
                        >
                            Remover
                        </Button>
                    </div>
                </div>
            ) : null}

            <UploadButton<UploadRouter, 'pointImage'>
                endpoint='pointImage'
                onUploadBegin={() => {
                    setUploading(true);
                }}
                onClientUploadComplete={(res) => {
                    setUploading(false);
                    const url = res?.[0]?.ufsUrl;
                    const key = res?.[0]?.key;
                    if (url) {
                        onChange(url, { key });
                        toast.success('Upload concluído!');
                    }
                }}
                onUploadError={(err) => {
                    setUploading(false);
                    toast.error(err.message);
                }}
                appearance={{
                    button: classname,
                    container: 'justify-start',
                }}
                content={{
                    button({ isUploading }) {
                        if (uploading || isUploading) return 'Enviando…';
                        return value ? 'Trocar imagem' : 'Enviar imagem';
                    },
                }}
            />
        </div>
    );
}

const classname = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 gap-2`;
