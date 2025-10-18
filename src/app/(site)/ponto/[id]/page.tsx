import { use } from "react";
import { PointDetailPageClient } from "./PointDetailPageClient";

export default function PointDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params); // <- desembrulha a Promise
    return <PointDetailPageClient id={id} />;
}
