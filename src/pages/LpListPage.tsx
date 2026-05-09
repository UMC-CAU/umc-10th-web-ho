import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLps } from "../apis/lps";
import LpCard from "../components/LpCard";
import { ErrorState, LoadingState } from "../components/QueryState";
import type { SortOrder } from "../types/lp";

export default function LpListPage() {
    const [sort, setSort] = useState<SortOrder>("desc");
    const { data: lps = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["lps", sort],
        queryFn: () => getLps(sort),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });

    return (
        <section className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-950">LP 목록</h1>
                    <p className="mt-1 text-sm text-gray-500">좋아하는 LP를 둘러보고 상세 정보를 확인해보세요.</p>
                </div>
                <div className="inline-flex w-fit rounded-md border border-gray-200 bg-white p-1">
                    <button
                        type="button"
                        onClick={() => setSort("desc")}
                        className={`rounded px-3 py-2 text-sm ${
                            sort === "desc" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        최신순
                    </button>
                    <button
                        type="button"
                        onClick={() => setSort("asc")}
                        className={`rounded px-3 py-2 text-sm ${
                            sort === "asc" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        오래된순
                    </button>
                </div>
            </div>

            {isLoading ? <LoadingState /> : null}
            {isError ? <ErrorState onRetry={() => void refetch()} /> : null}
            {!isLoading && !isError ? (
                lps.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {lps.map((lp) => (
                            <LpCard key={lp.id} lp={lp} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                        등록된 LP가 없습니다.
                    </div>
                )
            ) : null}
        </section>
    );
}
