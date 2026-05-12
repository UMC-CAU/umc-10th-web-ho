import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateLpMutation } from "../hooks/useLpMutations";

export default function LpCreatePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [tags, setTags] = useState("");
    const mutation = useCreateLpMutation({
        onSuccess: (lp) => {
            navigate(`/lp/${lp.id}`);
        },
    });

    return (
        <section className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-950">LP 작성</h1>
            <form
                className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                onSubmit={(event) => {
                    event.preventDefault();
                    mutation.mutate({
                        title,
                        content,
                        thumbnail,
                        tags: tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        published: true,
                    });
                }}
            >
                <input
                    className="rounded-md border border-gray-200 px-4 py-2"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="제목"
                    required
                />
                <input
                    className="rounded-md border border-gray-200 px-4 py-2"
                    value={thumbnail}
                    onChange={(event) => setThumbnail(event.target.value)}
                    placeholder="썸네일 이미지 URL"
                    required
                />
                <input
                    className="rounded-md border border-gray-200 px-4 py-2"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="태그를 쉼표로 구분해서 입력"
                />
                <textarea
                    className="min-h-44 rounded-md border border-gray-200 px-4 py-2"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="본문"
                    required
                />
                {mutation.isError ? <p className="text-sm text-red-500">LP 생성에 실패했습니다. 다시 시도해주세요.</p> : null}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="rounded-md bg-pink-500 px-4 py-2 font-medium text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {mutation.isPending ? "작성 중..." : "작성하기"}
                </button>
            </form>
        </section>
    );
}
