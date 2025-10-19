'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function TokenCardSkeleton({ className }: { className?: string }) {
    return (
        <div
            data-slot="card"
            className={cn(
                'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm overflow-hidden',
                className
            )}
        >
            <div data-slot="card-content" className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </div>

                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-56 mb-4" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
    );
}
