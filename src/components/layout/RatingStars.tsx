/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star } from 'lucide-react';

export function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
    const fiveScale = Math.max(0, Math.min(5, rating / 2));
    const full = Math.floor(fiveScale);
    const hasHalf = fiveScale - full >= 0.5;

    return (
        <div className='inline-flex items-center gap-0.5 text-yellow-500' aria-label={`Nota ${rating} de 10`}>
            {[0, 1, 2, 3, 4].map((i) => {
                const state = i < full ? 'full' : i === full && hasHalf ? 'half' : 'empty';
                return <StarIcon key={i} state={state} size={size} />;
            })}
        </div>
    );
}

function StarIcon({ state, size }: { state: 'full' | 'half' | 'empty'; size: number }) {
    if (state === 'full') return <Star size={size} className='fill-current' />;
    if (state === 'half') return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <Star size={size} className='absolute inset-0' />

            <Star size={size} className='absolute inset-0 overflow-hidden' style={{ clipPath: 'inset(0 50% 0 0)', fill: 'currentColor' as any }} />
        </div>
    );
    return <Star size={size} className='opacity-40' />;
}
