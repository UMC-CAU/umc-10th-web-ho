export type SortOrder = "asc" | "desc";

export interface CommonResponse<T> {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export interface Tag {
    id: number;
    name: string;
}

export interface Like {
    id: number;
    userId: number;
    lpId: number;
}

export interface Lp {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Like[];
}

export interface LpListData {
    data: Lp[];
    nextCursor?: number | null;
    hasNext?: boolean;
}

export interface CreateLpRequest {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
}
