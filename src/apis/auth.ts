import axiosInstance from "./axios";

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
