"use client";
import { useEffect, useState } from "react";
import { Hero } from "@/components/containers/Hero";
import { FiltersMenu, type FiltersState } from "@/components/layout/Filters";
import { PointCard, type PointCardProps } from "@/components/layout/PointCard";

// mocks temporários – substitua por fetch/Server Component
const mockCategories = [
    { id: 1, name: "Monumento" },
    { id: 2, name: "Patrimônio Histórico" },
    { id: 3, name: "Sítio Arqueológico" },
];

const mockPoints: PointCardProps[] = [
    { id: 1, name: "Arcos da Lapa", city: "Rio de Janeiro", country: "Brasil", description: "Cartão-postal histórico.", category: { id: 2, name: "Patrimônio Histórico" }, ratingAvg: 8.6, ratingCount: 128, photoUrl: "/placeholder.jpg" },
    { id: 2, name: "Museu do Amanhã", city: "Rio de Janeiro", country: "Brasil", description: "Museu de ciências aplicadas.", category: { id: 4, name: "Museu" }, ratingAvg: 9.1, ratingCount: 203, photoUrl: "/placeholder.jpg" },
];

export default function PointsPage() {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState<FiltersState>({});
    const [items, setItems] = useState<PointCardProps[]>(mockPoints);

    useEffect(() => {
        // filtro local simplificado
        const q = query.toLowerCase();
        let arr = mockPoints.filter((p) =>
            [p.name, p.city, p.country, p.category?.name].some((v) => (v ?? "").toLowerCase().includes(q))
        );
        if (filters.categoryId) arr = arr.filter((p) => String(p.category?.id) === filters.categoryId);
        if (typeof filters.minRating === "number") arr = arr.filter((p) => (p.ratingAvg ?? 0) >= filters.minRating!);
        setItems(arr);
    }, [query, filters]);

    return (
        <div className="space-y-4">
            <Hero onSearch={setQuery} />
            <FiltersMenu categories={mockCategories} value={filters} onChange={setFilters} />
            <section className="container mx-auto px-4 pb-12">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((p) => (
                        <PointCard key={p.id} {...p} />
                    ))}
                </div>
            </section>
        </div>
    );
}