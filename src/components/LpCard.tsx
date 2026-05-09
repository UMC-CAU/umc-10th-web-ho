import { Link } from "react-router-dom";
import type { Lp } from "../types/lp";
import { formatDate } from "../utils/formatDate";

type LpCardProps = {
    lp: Lp;
};

export default function LpCard({ lp }: LpCardProps) {
    return (
        <Link
            to={`/lp/${lp.id}`}
            className="group relative block aspect-square overflow-hidden rounded-lg bg-gray-200 shadow-sm transition duration-200 hover:scale-[1.03] hover:shadow-lg"
        >
            {lp.thumbnail ? (
                <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                    No Image
                </div>
            )}
            <div className="absolute inset-0 flex translate-y-3 flex-col justify-end bg-black/65 p-4 text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="line-clamp-2 text-base font-semibold">{lp.title}</h3>
                <p className="mt-2 text-xs text-gray-200">{formatDate(lp.createdAt)}</p>
                <p className="mt-1 text-xs text-gray-200">좋아요 {lp.likes.length}</p>
            </div>
        </Link>
    );
}
