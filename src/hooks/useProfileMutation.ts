import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMe } from "../apis/auth";
import type { AuthUser, UpdateProfileRequest } from "../types/auth";
import { useLocalStorage } from "./useLocalStorage";
import { queryKeys } from "./queryKeys";

export function useUpdateProfileMutation(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();
    const { setItem: setUser } = useLocalStorage<AuthUser>("USER");

    return useMutation({
        mutationFn: (payload: UpdateProfileRequest) => patchMe(payload),
        onSuccess: (user) => {
            setUser(user);
            queryClient.setQueryData(queryKeys.me, user);
            void queryClient.invalidateQueries({ queryKey: queryKeys.me });
            options?.onSuccess?.();
        },
        onError: (error) => {
            console.error(error);
            alert("프로필 수정에 실패했습니다.");
        },
    });
}
