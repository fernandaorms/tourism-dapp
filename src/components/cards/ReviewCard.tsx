// components/point/ReviewCard.tsx
import Link from "next/link"

export function ReviewCard({
    review,
}: {
    review: {
        id: number
        username: string
        rating: number
        comment: string
        createdAt: string
        onchainTxHash?: string
        walletAddress: string
    }
}) {
    const date = new Date(review.createdAt)
    const shortWallet = `${review.walletAddress.slice(0, 6)}…${review.walletAddress.slice(-4)}`

    return (
        <article className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{review.username}</div>
                <div className="text-sm">★ {review.rating}</div>
            </div>

            <p className="mt-2 text-sm leading-6">{review.comment}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{date.toLocaleDateString()}</span>
                <span className="rounded border px-1.5 py-0.5">{shortWallet}</span>
                {review.onchainTxHash && (
                    <Link
                        href={`https://etherscan.io/tx/${review.onchainTxHash}`}
                        className="underline underline-offset-4"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ver transação
                    </Link>
                )}
            </div>
        </article>
    )
}
