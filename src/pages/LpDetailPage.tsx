import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getLp, getLpComments } from "../apis/lps";
import FallbackImage from "../components/FallbackImage";
import { ErrorState, LoadingState } from "../components/QueryState";
import { CommentSkeletonList } from "../components/Skeletons";
import type { Comment, SortOrder } from "../types/lp";
import { formatDate } from "../utils/formatDate";

function isSortOrder(value: string | null): value is SortOrder {
    return value === "asc" || value === "desc";
}

function CommentItem({ comment }: { comment: Comment }) {
    const authorName = comment.author?.name ?? comment.author?.email ?? `User ${comment.authorId ?? "Unknown"}`;

    return (
        <li className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {authorName.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="font-semibold text-gray-950">{authorName}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap leading-6 text-gray-700">{comment.content}</p>
                </div>
            </div>
        </li>
    );
}

export default function LpDetailPage() {
    const { lpid } = useParams();
    const lpId = lpid ?? "";
    const [searchParams, setSearchParams] = useSearchParams();
    const orderParam = searchParams.get("order");
    const order: SortOrder = isSortOrder(orderParam) ? orderParam : "desc";
    const commentLoadMoreRef = useRef<HTMLDivElement | null>(null);
    const { data: lp, isLoading, isError, refetch } = useQuery({
        queryKey: ["lp", lpId],
        queryFn: () => getLp(lpId),
        enabled: Boolean(lpId),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
    const {
        data: commentData,
        isPending: isCommentsPending,
        isError: isCommentsError,
        refetch: refetchComments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["lpComments", lpId, order],
        queryFn: ({ pageParam }) => getLpComments(lpId, { cursor: pageParam, order }),
        enabled: Boolean(lpId),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
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
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <button className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
                                수정
                            </button>
                            <button className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                삭제
                            </button>
                            <button className="rounded-md bg-pink-500 px-3 py-2 text-sm text-white hover:bg-pink-600">
                                좋아요
                            </button>
                        </div>
                    </div>

                    <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 leading-7 text-gray-700">
                        {lp.content}
                    </div>

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

                <form className="grid gap-2 rounded-lg border border-gray-200 bg-white p-4">
                    <label htmlFor="comment" className="text-sm font-semibold text-gray-950">
                        댓글 작성
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            id="comment"
                            type="text"
                            placeholder="댓글을 입력하세요"
                            className="min-h-11 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                        />
                        <button
                            type="button"
                            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
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
                                    <CommentItem key={comment.id} comment={comment} />
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
