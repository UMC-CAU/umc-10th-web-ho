import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FallbackImage from "../components/FallbackImage";
import { ErrorState, LoadingState } from "../components/QueryState";
import { CommentSkeletonList } from "../components/Skeletons";
import { useCreateCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from "../hooks/useCommentMutations";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useDeleteLpMutation, useToggleLikeMutation, useUpdateLpMutation } from "../hooks/useLpMutations";
import { useLpCommentsQuery, useLpDetailQuery } from "../hooks/useLpQueries";
import type { Comment, Lp, SortOrder } from "../types/lp";
import { formatDate } from "../utils/formatDate";

function isSortOrder(value: string | null): value is SortOrder {
    return value === "asc" || value === "desc";
}

function CommentItem({ comment, lpId, currentUserId }: { comment: Comment; lpId: string; currentUserId?: number }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const updateMutation = useUpdateCommentMutation(lpId, {
        onSuccess: () => {
            setIsEditing(false);
            setIsMenuOpen(false);
        },
    });
    const deleteMutation = useDeleteCommentMutation(lpId);
    const authorName = comment.author?.name ?? comment.author?.email ?? `User ${comment.authorId ?? "Unknown"}`;
    const isMine = Boolean(currentUserId && comment.authorId === currentUserId);

    return (
        <li className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {authorName.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="font-semibold text-gray-950">{authorName}</p>
                            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                        </div>
                        {isMine ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen((value) => !value)}
                                >
                                    ...
                                </button>
                                {isMenuOpen ? (
                                    <div className="absolute right-0 z-10 mt-1 grid w-24 overflow-hidden rounded-md border border-gray-200 bg-white text-sm shadow-sm">
                                        <button
                                            type="button"
                                            className="px-3 py-2 text-left hover:bg-gray-50"
                                            onClick={() => {
                                                setContent(comment.content);
                                                setIsEditing(true);
                                            }}
                                        >
                                            수정
                                        </button>
                                        <button
                                            type="button"
                                            className="px-3 py-2 text-left text-red-600 hover:bg-red-50"
                                            onClick={() => deleteMutation.mutate(comment.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    {isEditing ? (
                        <form
                            className="mt-3 grid gap-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (!content.trim()) return;
                                updateMutation.mutate({ commentId: comment.id, content: content.trim() });
                            }}
                        >
                            <input
                                className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                                    onClick={() => setIsEditing(false)}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60"
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="mt-2 whitespace-pre-wrap leading-6 text-gray-700">{comment.content}</p>
                    )}
                </div>
            </div>
        </li>
    );
}

function LpEditForm({ lp, onCancel }: { lp: Lp; onCancel: () => void }) {
    const [title, setTitle] = useState(lp.title);
    const [content, setContent] = useState(lp.content);
    const [thumbnail, setThumbnail] = useState(lp.thumbnail);
    const [published, setPublished] = useState(lp.published);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState(lp.tags.map((tag) => tag.name));
    const updateMutation = useUpdateLpMutation(String(lp.id), { onSuccess: onCancel });

    const addTag = () => {
        const tag = tagInput.trim();
        if (!tag || tags.includes(tag)) return;
        setTags((currentTags) => [...currentTags, tag]);
        setTagInput("");
    };

    return (
        <form
            className="grid gap-3 rounded-lg bg-gray-50 p-4"
            onSubmit={(event) => {
                event.preventDefault();
                updateMutation.mutate({ title, content, thumbnail, tags, published });
            }}
        >
            <input className="rounded-md border border-gray-200 px-4 py-2" value={title} onChange={(event) => setTitle(event.target.value)} />
            <input className="rounded-md border border-gray-200 px-4 py-2" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} />
            <textarea className="min-h-36 rounded-md border border-gray-200 px-4 py-2" value={content} onChange={(event) => setContent(event.target.value)} />
            <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
                공개
            </label>
            <div className="flex gap-2">
                <input
                    className="min-w-0 flex-1 rounded-md border border-gray-200 px-4 py-2"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    placeholder="태그"
                />
                <button type="button" className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-white" onClick={addTag}>
                    추가
                </button>
            </div>
            {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs text-pink-600">
                            #{tag}
                            <button type="button" onClick={() => setTags((currentTags) => currentTags.filter((item) => item !== tag))}>
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            ) : null}
            <div className="flex justify-end gap-2">
                <button type="button" className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-white" onClick={onCancel}>
                    취소
                </button>
                <button type="submit" disabled={updateMutation.isPending} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60">
                    {updateMutation.isPending ? "저장 중..." : "저장"}
                </button>
            </div>
        </form>
    );
}

export default function LpDetailPage() {
    const { lpid } = useParams();
    const lpId = lpid ?? "";
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const orderParam = searchParams.get("order");
    const order: SortOrder = isSortOrder(orderParam) ? orderParam : "desc";
    const commentLoadMoreRef = useRef<HTMLDivElement | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [isEditingLp, setIsEditingLp] = useState(false);
    const { user } = useCurrentUser();
    const { data: lp, isLoading, isError, refetch } = useLpDetailQuery(lpId);
    const {
        data: commentData,
        isPending: isCommentsPending,
        isError: isCommentsError,
        refetch: refetchComments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useLpCommentsQuery(lpId, order);
    const createCommentMutation = useCreateCommentMutation(lpId, {
        onSuccess: () => setCommentContent(""),
    });
    const deleteLpMutation = useDeleteLpMutation(lpId, {
        onSuccess: () => navigate("/", { replace: true }),
    });
    const toggleLikeMutation = useToggleLikeMutation(lpId, user?.id);
    const comments = commentData?.pages.flatMap((page) => page.data) ?? [];

    useEffect(() => {
        const target = commentLoadMoreRef.current;

        if (!target) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            { rootMargin: "160px 0px" },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleOrderChange = (nextOrder: SortOrder) => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);
            nextParams.set("order", nextOrder);
            return nextParams;
        });
    };

    if (isLoading) {
        return (
            <section className="mx-auto max-w-4xl">
                <LoadingState />
            </section>
        );
    }

    if (isError || !lp) {
        return (
            <section className="mx-auto max-w-4xl">
                <ErrorState onRetry={() => void refetch()} />
            </section>
        );
    }

    const isAuthor = user?.id === lp.authorId;
    const liked = Boolean(user?.id && lp.likes.some((like) => like.userId === user.id));

    return (
        <article className="mx-auto grid max-w-4xl gap-6">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <FallbackImage
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="max-h-[520px] w-full object-cover"
                    fallbackClassName="max-h-[520px] w-full object-cover"
                />
                <div className="grid gap-5 p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-950">{lp.title}</h1>
                            <p className="mt-2 text-sm text-gray-500">
                                {formatDate(lp.createdAt)} · 좋아요 {lp.likes.length}
                            </p>
                            {lp.author ? <p className="mt-1 text-sm text-gray-500">by {lp.author.name ?? lp.author.email}</p> : null}
                        </div>
                        <div className="flex shrink-0 gap-2">
                            {isAuthor ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingLp((value) => !value)}
                                        className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm("LP를 삭제하시겠습니까?")) deleteLpMutation.mutate();
                                        }}
                                        disabled={deleteLpMutation.isPending}
                                        className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                                    >
                                        삭제
                                    </button>
                                </>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => toggleLikeMutation.mutate(liked)}
                                disabled={toggleLikeMutation.isPending}
                                className={`rounded-md px-3 py-2 text-sm text-white ${
                                    liked ? "bg-gray-900 hover:bg-gray-800" : "bg-pink-500 hover:bg-pink-600"
                                } disabled:opacity-60`}
                            >
                                {liked ? "좋아요 취소" : "좋아요"}
                            </button>
                        </div>
                    </div>

                    {isEditingLp ? <LpEditForm lp={lp} onCancel={() => setIsEditingLp(false)} /> : null}

                    <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 leading-7 text-gray-700">{lp.content}</div>

                    {lp.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {lp.tags.map((tag) => (
                                <span key={tag.id} className="rounded-full bg-pink-50 px-3 py-1 text-xs text-pink-600">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <section className="grid gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-gray-950">댓글</h2>
                    <div className="inline-flex w-fit rounded-md border border-gray-200 bg-white p-1">
                        <button
                            type="button"
                            onClick={() => handleOrderChange("desc")}
                            className={`rounded px-3 py-2 text-sm ${
                                order === "desc" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            최신순
                        </button>
                        <button
                            type="button"
                            onClick={() => handleOrderChange("asc")}
                            className={`rounded px-3 py-2 text-sm ${
                                order === "asc" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            오래된순
                        </button>
                    </div>
                </div>

                <form
                    className="grid gap-2 rounded-lg border border-gray-200 bg-white p-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!commentContent.trim()) return;
                        createCommentMutation.mutate({ content: commentContent.trim() });
                    }}
                >
                    <label htmlFor="comment" className="text-sm font-semibold text-gray-950">
                        댓글 작성
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            id="comment"
                            type="text"
                            value={commentContent}
                            onChange={(event) => setCommentContent(event.target.value)}
                            placeholder="댓글을 입력하세요"
                            className="min-h-11 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                        />
                        <button
                            type="submit"
                            disabled={createCommentMutation.isPending || !commentContent.trim()}
                            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            작성
                        </button>
                    </div>
                    <p className="text-xs text-pink-600">댓글 내용이 비어 있으면 작성할 수 없습니다.</p>
                </form>

                {isCommentsPending ? <CommentSkeletonList /> : null}
                {isCommentsError ? <ErrorState onRetry={() => void refetchComments()} /> : null}
                {!isCommentsPending && !isCommentsError ? (
                    comments.length > 0 ? (
                        <>
                            <ul className="grid gap-3">
                                {comments.map((comment) => (
                                    <CommentItem key={comment.id} comment={comment} lpId={lpId} currentUserId={user?.id} />
                                ))}
                            </ul>
                            {isFetchingNextPage ? <CommentSkeletonList count={2} /> : null}
                            <div ref={commentLoadMoreRef} className="h-8" aria-hidden="true" />
                        </>
                    ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                            아직 댓글이 없습니다.
                        </div>
                    )
                ) : null}
            </section>
        </article>
    );
}
