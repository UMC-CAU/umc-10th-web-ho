import { useMutation, useQueryClient, type InfiniteData, type QueryKey } from "@tanstack/react-query";
import { createLp, deleteLp, likeLp, unlikeLp, updateLp } from "../apis/lps";
import type { CreateLpRequest, Lp, LpListData, UpdateLpRequest } from "../types/lp";
import { queryKeys } from "./queryKeys";

type LpListCacheSnapshot = Array<[QueryKey, InfiniteData<LpListData> | undefined]>;

function getOptimisticLp(lp: Lp, currentLiked: boolean, userId?: number): Lp {
    if (!userId) {
        return lp;
    }

    const nextLikes = currentLiked
        ? lp.likes.filter((like) => like.userId !== userId)
        : lp.likes.some((like) => like.userId === userId)
          ? lp.likes
          : [...lp.likes, { id: -Date.now(), userId, lpId: lp.id }];

    return {
        ...lp,
        likes: nextLikes,
    };
}

function getOptimisticLpListData(data: InfiniteData<LpListData>, lpId: string, currentLiked: boolean, userId?: number) {
    const targetLpId = Number(lpId);

    return {
        ...data,
        pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((lp) => (lp.id === targetLpId ? getOptimisticLp(lp, currentLiked, userId) : lp)),
        })),
    };
}

export function useCreateLpMutation(options?: { onSuccess?: (lp: Lp) => void }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateLpRequest) => createLp(payload),
        onSuccess: (lp) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.all });
            options?.onSuccess?.(lp);
        },
        onError: (error) => {
            console.error(error);
            alert("LP 생성에 실패했습니다.");
        },
    });
}

export function useUpdateLpMutation(lpId: string, options?: { onSuccess?: (lp: Lp) => void }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateLpRequest) => updateLp(lpId, payload),
        onSuccess: (lp) => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.detail(lpId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.all });
            options?.onSuccess?.(lp);
        },
        onError: (error) => {
            console.error(error);
            alert("LP 수정에 실패했습니다.");
        },
    });
}

export function useDeleteLpMutation(lpId: string, options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteLp(lpId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.all });
            options?.onSuccess?.();
        },
        onError: (error) => {
            console.error(error);
            alert("LP 삭제에 실패했습니다.");
        },
    });
}

export function useToggleLikeMutation(lpId: string, userId?: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (liked: boolean) => (liked ? unlikeLp(lpId) : likeLp(lpId)),
        onMutate: async (liked) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: queryKeys.lps.detail(lpId) }),
                queryClient.cancelQueries({ queryKey: queryKeys.lps.all }),
            ]);

            const previousLp = queryClient.getQueryData<Lp>(queryKeys.lps.detail(lpId));
            const previousLpLists = queryClient.getQueriesData<InfiniteData<LpListData>>({
                queryKey: queryKeys.lps.all,
            }) as LpListCacheSnapshot;

            queryClient.setQueryData<Lp>(queryKeys.lps.detail(lpId), (currentLp) =>
                currentLp ? getOptimisticLp(currentLp, liked, userId) : currentLp,
            );
            queryClient.setQueriesData<InfiniteData<LpListData>>({ queryKey: queryKeys.lps.all }, (currentData) =>
                currentData ? getOptimisticLpListData(currentData, lpId, liked, userId) : currentData,
            );

            return { previousLp, previousLpLists };
        },
        onError: (error, _liked, context) => {
            console.error(error);

            if (context?.previousLp) {
                queryClient.setQueryData<Lp>(queryKeys.lps.detail(lpId), context.previousLp);
            }

            context?.previousLpLists.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });

            alert("좋아요 처리에 실패했습니다.");
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.detail(lpId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.all });
        },
    });
}
