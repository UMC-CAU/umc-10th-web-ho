import axiosInstance from "./axios";
import type { CommentListData, CommonResponse, CreateLpRequest, Lp, LpListData, SortOrder } from "../types/lp";

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
