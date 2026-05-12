import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, updateComment } from "../apis/lps";
import type { CreateCommentRequest, UpdateCommentRequest } from "../types/lp";
import { queryKeys } from "./queryKeys";

export function useCreateCommentMutation(lpId: string, options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCommentRequest) => createComment(lpId, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.commentsAll(lpId) });
            options?.onSuccess?.();
        },
        onError: (error) => {
            console.error(error);
            alert("댓글 작성에 실패했습니다.");
        },
    });
}

export function useUpdateCommentMutation(lpId: string, options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: number } & UpdateCommentRequest) =>
            updateComment(lpId, commentId, { content }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.commentsAll(lpId) });
            options?.onSuccess?.();
        },
        onError: (error) => {
            console.error(error);
            alert("댓글 수정에 실패했습니다.");
        },
    });
}

export function useDeleteCommentMutation(lpId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: number) => deleteComment(lpId, commentId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.lps.commentsAll(lpId) });
        },
        onError: (error) => {
            console.error(error);
            alert("댓글 삭제에 실패했습니다.");
        },
    });
}
