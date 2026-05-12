import axiosInstance from "./axios";
import type {
    Comment,
    CommentListData,
    CommonResponse,
    CreateCommentRequest,
    CreateLpRequest,
    Like,
    Lp,
    LpListData,
    SortOrder,
    UpdateCommentRequest,
    UpdateLpRequest,
} from "../types/lp";

type InfiniteListParams = {
    cursor?: number;
    order: SortOrder;
};

export async function getLps({ cursor = 0, order }: InfiniteListParams) {
    const response = await axiosInstance.get<CommonResponse<LpListData>>("/lps", {
        params: {
            cursor,
            limit: 20,
            search: "",
            order,
        },
    });

    return response.data.data;
}

export async function getLp(lpid: string) {
    const response = await axiosInstance.get<CommonResponse<Lp>>(`/lps/${lpid}`);
    return response.data.data;
}

export async function createLp(payload: CreateLpRequest) {
    const response = await axiosInstance.post<CommonResponse<Lp>>("/lps", payload);
    return response.data.data;
}

export async function updateLp(lpId: string, payload: UpdateLpRequest) {
    const response = await axiosInstance.patch<CommonResponse<Lp>>(`/lps/${lpId}`, payload);
    return response.data.data;
}

export async function deleteLp(lpId: string) {
    const response = await axiosInstance.delete<CommonResponse<boolean>>(`/lps/${lpId}`);
    return response.data.data;
}

export async function getLpComments(lpId: string, { cursor = 0, order }: InfiniteListParams) {
    const response = await axiosInstance.get<CommonResponse<CommentListData>>(`/lps/${lpId}/comments`, {
        params: {
            cursor,
            limit: 10,
            order,
        },
    });

    return response.data.data;
}

export async function createComment(lpId: string, payload: CreateCommentRequest) {
    const response = await axiosInstance.post<CommonResponse<Comment>>(`/lps/${lpId}/comments`, payload);
    return response.data.data;
}

export async function updateComment(lpId: string, commentId: number, payload: UpdateCommentRequest) {
    const response = await axiosInstance.patch<CommonResponse<Comment>>(`/lps/${lpId}/comments/${commentId}`, payload);
    return response.data.data;
}

export async function deleteComment(lpId: string, commentId: number) {
    const response = await axiosInstance.delete<CommonResponse<null>>(`/lps/${lpId}/comments/${commentId}`);
    return response.data;
}

export async function likeLp(lpId: string) {
    const response = await axiosInstance.post<CommonResponse<Like>>(`/lps/${lpId}/likes`);
    return response.data.data;
}

export async function unlikeLp(lpId: string) {
    const response = await axiosInstance.delete<CommonResponse<Like>>(`/lps/${lpId}/likes`);
    return response.data.data;
}
