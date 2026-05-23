import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteMe, postLogin, postSignOut } from "../apis/auth";
import type { AuthUser, LoginFormValues } from "../types/auth";
import { useLocalStorage } from "./useLocalStorage";
import { queryKeys } from "./queryKeys";

function useClearAuthStorage() {
    const { removeItem: removeAccessToken } = useLocalStorage<string>("ACCESS_TOKEN");
    const { removeItem: removeRefreshToken } = useLocalStorage<string>("REFRESH_TOKEN");
    const { removeItem: removeUser } = useLocalStorage<AuthUser>("USER");

    return () => {
        removeAccessToken();
        removeRefreshToken();
        removeUser();
    };
}

export function useLoginMutation(fromPath: string) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setItem: setAuthToken } = useLocalStorage<string>("ACCESS_TOKEN");
    const { setItem: setRefreshToken } = useLocalStorage<string>("REFRESH_TOKEN");
    const { setItem: setUser } = useLocalStorage<AuthUser>("USER");

    return useMutation({
        mutationFn: (values: LoginFormValues) => postLogin(values),
        onSuccess: (user) => {
            setAuthToken(user.accessToken);
            if (user.refreshToken) setRefreshToken(user.refreshToken);
            setUser({ id: user.id, name: user.name, email: user.email });
            void queryClient.invalidateQueries({ queryKey: queryKeys.me });
            navigate(fromPath, { replace: true });
        },
        onError: (error) => {
            console.error(error);
            alert("로그인에 실패했습니다.");
        },
    });
}

export function useLogoutMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const clearAuthStorage = useClearAuthStorage();

    return useMutation({
        mutationFn: postSignOut,
        onSettled: () => {
            clearAuthStorage();
            queryClient.clear();
            navigate("/login", { replace: true });
        },
    });
}

export function useWithdrawMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const clearAuthStorage = useClearAuthStorage();

    return useMutation({
        mutationFn: deleteMe,
        onSuccess: () => {
            clearAuthStorage();
            queryClient.clear();
            navigate("/login", { replace: true });
        },
        onError: (error) => {
            console.error(error);
            alert("탈퇴 처리에 실패했습니다.");
        },
    });
}
