import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp, deleteLp, likeLp, unlikeLp, updateLp } from "../apis/lps";
import type { CreateLpRequest, Lp, UpdateLpRequest } from "../types/lp";
import { queryKeys } from "./queryKeys";

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
            await queryClient.cancelQueries({ queryKey: queryKeys.lps.detail(lpId) });
            const previousLp = queryClient.getQueryData<Lp>(queryKeys.lps.detail(lpId));

            if (previousLp && userId) {
                queryClient.setQueryData<Lp>(queryKeys.lps.detail(lpId), {
                    ...previousLp,
                    likes: liked
                        ? previousLp.likes.filter((like) => like.userId !== userId)
                        : [...previousLp.likes, { id: Date.now() * -1, userId, lpId: previousLp.id }],
                });
            }

            return { previousLp };
        },
        onError: (error, _liked, context) => {
            console.error(error);
            if (context?.previousLp) {
                queryClient.setQueryData(queryKeys.lps.detail(lpId), context.previousLp);
            }
            alert("좋아요 처리에 실패했습니다.");
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.detail(lpId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.all });
        },
    });
}
