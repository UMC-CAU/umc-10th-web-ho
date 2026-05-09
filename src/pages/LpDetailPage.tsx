import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getLp } from "../apis/lps";
import { ErrorState, LoadingState } from "../components/QueryState";
import { formatDate } from "../utils/formatDate";

export default function LpDetailPage() {
    const { lpid } = useParams();
    const { data: lp, isLoading, isError, refetch } = useQuery({
        queryKey: ["lp", lpid],
        queryFn: () => getLp(lpid!),
        enabled: Boolean(lpid),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <section className="mx-auto max-w-4xl">
                <LoadingState />
            </section>
        );
    }

    if (isError || !lp) {
        return (
            <section className="mx-auto max-w-4xl">
                <ErrorState onRetry={() => void refetch()} />
            </section>
        );
    }

    return (
        <article className="mx-auto grid max-w-4xl gap-6">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {lp.thumbnail ? (
                    <img src={lp.thumbnail} alt={lp.title} className="max-h-[520px] w-full object-cover" />
                ) : (
                    <div className="flex h-80 items-center justify-center bg-gray-200 text-gray-500">No Image</div>
                )}
                <div className="grid gap-5 p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-950">{lp.title}</h1>
                            <p className="mt-2 text-sm text-gray-500">
                                {formatDate(lp.createdAt)} · 좋아요 {lp.likes.length}
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <button className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
                                수정
                            </button>
                            <button className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                삭제
                            </button>
                            <button className="rounded-md bg-pink-500 px-3 py-2 text-sm text-white hover:bg-pink-600">
                                좋아요
                            </button>
                        </div>
                    </div>

                    <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 leading-7 text-gray-700">
                        {lp.content}
                    </div>

                    {lp.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {lp.tags.map((tag) => (
                                <span key={tag.id} className="rounded-full bg-pink-50 px-3 py-1 text-xs text-pink-600">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
