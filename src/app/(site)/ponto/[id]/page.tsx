// app/point/[id]/page.tsx
import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { PointDetailClient } from "./PointDetailClient"

export default async function PointPage({ params }: { params: { id: string } }) {
    const pointId = Number(params.id)
    if (Number.isNaN(pointId)) return notFound()

    const point = await prisma.point.findUnique({
        where: { id: pointId },
        select: {
            id: true, name: true, description: true, city: true, country: true, photoUrl: true,
            category: { select: { id: true, name: true } },
            reviews: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true, rating: true, comment: true, createdAt: true,
                    onchainTxHash: true, walletAddress: true,
                    user: { select: { username: true } },
                },
            },
        },
    })

    if (!point) return notFound()

    const ratingCount = point.reviews.length
    const ratingAvg = ratingCount
        ? Number((point.reviews.reduce((a, r) => a + r.rating, 0) / ratingCount).toFixed(1))
        : 0

    return (
        <div className="flex flex-col">
            {/* Banner */}
            <div className="relative h-72 md:h-96 w-full">
                <Image
                    src={point.photoUrl}
                    alt={point.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8">
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{point.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{point.city}, {point.country}</span>
                        {point.category && (
                            <span className="rounded-md border px-2 py-0.5">{point.category.name}</span>
                        )}
                        <span>★ {ratingAvg} · {ratingCount} avaliações</span>
                    </div>
                </header>

                <PointDetailClient
                    point={{
                        id: point.id,
                        name: point.name,
                        description: point.description ?? '',
                        city: point.city,
                        country: point.country,
                        categoryName: point.category?.name,
                        ratingAvg,
                        ratingCount,
                        reviews: point.reviews.map(r => ({
                            id: r.id,
                            username: r.user.username,
                            rating: r.rating,
                            comment: r.comment ?? '',
                            createdAt: r.createdAt.toISOString(),
                            walletAddress: r.walletAddress,
                            onchainTxHash: r.onchainTxHash ?? undefined,
                        })),
                    }}
                />
            </div>
        </div>
    )
}
