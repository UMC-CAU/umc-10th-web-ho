import axiosInstance from "./axios";
import type { AuthUser, UpdateProfileRequest } from "../types/auth";

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

interface CommonResponse<T> {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface SignInResponseData {
    id: number;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}

export async function postSignup(payload: SignupRequest) {
    const response = await axiosInstance.post("/auth/signup", payload);
    return response.data;
}

export async function postLogin(payload: LoginRequest) {
    const response = await axiosInstance.post<CommonResponse<SignInResponseData>>(
        "/auth/signin",
        payload,
    );
    return response.data.data;
}

export async function getMe() {
    const response = await axiosInstance.get<CommonResponse<AuthUser>>("/users/me");
    return response.data.data;
}

export function getGoogleLoginUrl() {
    const baseUrl = import.meta.env.VITE_SERVER_API_URL.replace(/\/$/, "");

    return `${baseUrl}/auth/google`;
}

export async function postSignOut() {
    const response = await axiosInstance.post("/auth/signout");
    return response.data;
}

export async function patchMe(payload: UpdateProfileRequest) {
    const response = await axiosInstance.patch<CommonResponse<AuthUser>>("/users", payload);
    return response.data.data;
}

export async function deleteMe() {
    const response = await axiosInstance.delete<CommonResponse<boolean>>("/users");
    return response.data.data;
}
