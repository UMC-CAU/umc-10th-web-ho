import { useEffect, useRef, useState } from "react";
import LpCard from "../components/LpCard";
import { ErrorState } from "../components/QueryState";
import { LpCardSkeletonGrid } from "../components/Skeletons";
import { useDebounce } from "../hooks/useDebounce";
import { useLpsQuery } from "../hooks/useLpQueries";
import { useThrottle } from "../hooks/useThrottle";
import type { SortOrder } from "../types/lp";

export default function LpListPage() {
    const [sort, setSort] = useState<SortOrder>("desc");
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const [loadMoreSignal, setLoadMoreSignal] = useState(0);
    const throttledLoadMoreSignal = useThrottle(loadMoreSignal, 1000);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const {
        data,
        isPending,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useLpsQuery(sort, debouncedQuery);
    const lps = data?.pages.flatMap((page) => page.data) ?? [];

    useEffect(() => {
        const target = loadMoreRef.current;

        if (!target) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setLoadMoreSignal(Date.now());
                }
            },
            { rootMargin: "240px 0px" },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [lps.length]);

    useEffect(() => {
        if (throttledLoadMoreSignal === 0 || !hasNextPage || isFetchingNextPage) {
            return;
        }

        console.log("다음 페이지 요청:", new Date().toLocaleTimeString());
        void fetchNextPage();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, throttledLoadMoreSignal]);

    return (
        <section className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-950">LP 목록</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            좋아하는 LP를 검색하고 상세 정보를 확인해보세요.
                        </p>
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
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="검색어를 입력하세요"
                    className="min-h-11 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-gray-900"
                />
            </div>

            {isPending ? <LpCardSkeletonGrid /> : null}
            {isError ? <ErrorState onRetry={() => void refetch()} /> : null}
            {!isPending && !isError ? (
                lps.length > 0 ? (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {lps.map((lp) => (
                                <LpCard key={lp.id} lp={lp} />
                            ))}
                        </div>
                        {isFetchingNextPage ? (
                            <div className="mt-4">
                                <LpCardSkeletonGrid count={4} />
                            </div>
                        ) : null}
                        <div ref={loadMoreRef} className="h-8" aria-hidden="true" />
                    </>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                        {debouncedQuery.trim().length > 0 ? "검색 결과가 없습니다." : "등록된 LP가 없습니다."}
                    </div>
                )
            ) : null}
        </section>
    );
}
