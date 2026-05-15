import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMe } from "../apis/auth";
import type { AuthUser, UpdateProfileRequest } from "../types/auth";
import { useLocalStorage } from "./useLocalStorage";
import { queryKeys } from "./queryKeys";

export function useUpdateProfileMutation(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();
    const { getItem: getUser, setItem: setUser } = useLocalStorage<AuthUser>("USER");

    return useMutation({
        mutationFn: (payload: UpdateProfileRequest) => patchMe(payload),
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.me });

            const previousUser = queryClient.getQueryData<AuthUser>(queryKeys.me) ?? getUser();

            if (previousUser) {
                const optimisticUser = {
                    ...previousUser,
                    ...payload,
                };

                queryClient.setQueryData<AuthUser>(queryKeys.me, optimisticUser);
                setUser(optimisticUser);
            }

            return { previousUser };
        },
        onSuccess: (user) => {
            queryClient.setQueryData<AuthUser>(queryKeys.me, user);
            setUser(user);
            options?.onSuccess?.();
        },
        onError: (error, _payload, context) => {
            console.error(error);

            if (context?.previousUser) {
                queryClient.setQueryData<AuthUser>(queryKeys.me, context.previousUser);
                setUser(context.previousUser);
            }

            alert("프로필 수정에 실패했습니다.");
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.me });
        },
    });
}
