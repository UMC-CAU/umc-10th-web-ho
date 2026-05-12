import type { SortOrder } from "../types/lp";

export const queryKeys = {
    me: ["me"] as const,
    lps: {
        all: ["lps"] as const,
        list: (order: SortOrder) => ["lps", order] as const,
        detail: (lpId: string) => ["lp", lpId] as const,
        comments: (lpId: string, order: SortOrder) => ["lpComments", lpId, order] as const,
        commentsAll: (lpId: string) => ["lpComments", lpId] as const,
    },
};
