import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { RatingStars } from "@/components/layout/RatingStars";

export type PointCardProps = {
    id: number;
    name: string;
    description?: string | null;
    city: string;
    country: string;
    category?: { id: number; name: string } | null;
    photoUrl?: string | null;
    ratingAvg?: number;
    ratingCount?: number;
};

export function PointCard(p: PointCardProps) {
    return (
        <Card className="overflow-hidden">
            <Link href={`/point/${p.id}`} aria-label={`Ver ${p.name}`}>
                <div className="relative aspect-[16/10] w-full bg-muted">
                    {!!p.photoUrl && (
                        <Image src={p.photoUrl} alt={p.name} fill className="object-cover" />
                    )}
                </div>
            </Link>
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-1">{p.name}</h3>
                    {p.category?.name && <Badge variant="secondary">{p.category.name}</Badge>}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{p.city}, {p.country}</span>
                </div>
            </CardHeader>
            <CardContent>
                {p.description && <p className="line-clamp-3 text-sm text-muted-foreground">{p.description}</p>}
            </CardContent>
            <CardFooter className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <RatingStars rating={Math.round((p.ratingAvg ?? 0) * 10) / 10} />
                    <span className="text-muted-foreground">{(p.ratingAvg ?? 0).toFixed(1)} / 10</span>
                </div>
                <div className="text-muted-foreground">{p.ratingCount ?? 0} avaliações</div>
            </CardFooter>
        </Card>
    );
}