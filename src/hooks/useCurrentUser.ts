import { useQuery } from "@tanstack/react-query";
import { getMe } from "../apis/auth";
import { useLocalStorage } from "./useLocalStorage";
import type { AuthUser } from "../types/auth";
import { queryKeys } from "./queryKeys";

export function useCurrentUser() {
    const { getItem, setItem } = useLocalStorage<AuthUser>("USER");
    const { getItem: getAccessToken } = useLocalStorage<string>("ACCESS_TOKEN");
    const token = getAccessToken();
    const storedUser = getItem();

    const query = useQuery({
        queryKey: queryKeys.me,
        queryFn: async () => {
            const user = await getMe();
            setItem(user);
            return user;
        },
        enabled: Boolean(token),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        initialData: storedUser ?? undefined,
    });

    return {
        ...query,
        user: token ? query.data ?? storedUser ?? null : null,
        isLoggedIn: Boolean(token),
    };
}
