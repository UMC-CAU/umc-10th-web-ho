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

export interface Author {
    id: number;
    name?: string;
    email?: string;
    bio?: string | null;
    avatar?: string | null;
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
    author?: Author;
}

export interface LpListData {
    data: Lp[];
    nextCursor?: number | null;
    hasNext?: boolean;
}

export interface Comment {
    id: number;
    content: string;
    lpId: number;
    authorId?: number;
    createdAt: string;
    updatedAt?: string;
    author?: Author;
}

export interface CommentListData {
    data: Comment[];
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

export type UpdateLpRequest = CreateLpRequest;

export interface CreateCommentRequest {
    content: string;
}

export interface UpdateCommentRequest {
    content: string;
}
