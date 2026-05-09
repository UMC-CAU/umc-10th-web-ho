import axiosInstance from "./axios";
import type { CommonResponse, CreateLpRequest, Lp, LpListData, SortOrder } from "../types/lp";

export async function getLps(order: SortOrder) {
    const response = await axiosInstance.get<CommonResponse<LpListData>>("/lps", {
        params: {
            cursor: 0,
            limit: 20,
            search: "",
            order,
        },
    });

    return response.data.data.data;
}

export async function getLp(lpid: string) {
    const response = await axiosInstance.get<CommonResponse<Lp>>(`/lps/${lpid}`);
    return response.data.data;
}

export async function createLp(payload: CreateLpRequest) {
    const response = await axiosInstance.post<CommonResponse<Lp>>("/lps", payload);
    return response.data.data;
}
