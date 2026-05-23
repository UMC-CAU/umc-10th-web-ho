import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getLp, getLpComments, getLps } from "../apis/lps";
import type { SortOrder } from "../types/lp";
import { queryKeys } from "./queryKeys";

export function useLpsQuery(order: SortOrder, debouncedQuery = "") {
    const trimmedQuery = debouncedQuery.trim();
    const queryKey = trimmedQuery.length > 0 ? queryKeys.lps.search(trimmedQuery, order) : queryKeys.lps.list(order);

    return useInfiniteQuery({
        // 검색어가 있으면 debouncedQuery를 queryKey에 포함하고, 없으면 기존 LP 목록 캐시를 사용합니다.
        queryKey,
        queryFn: ({ pageParam }) =>
            getLps({
                cursor: pageParam,
                order,
                search: trimmedQuery,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
}

export function useLpDetailQuery(lpId: string) {
    return useQuery({
        queryKey: queryKeys.lps.detail(lpId),
        queryFn: () => getLp(lpId),
        enabled: Boolean(lpId),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
}

export function useLpCommentsQuery(lpId: string, order: SortOrder) {
    return useInfiniteQuery({
        queryKey: queryKeys.lps.comments(lpId, order),
        queryFn: ({ pageParam }) => getLpComments(lpId, { cursor: pageParam, order }),
        enabled: Boolean(lpId),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
}
