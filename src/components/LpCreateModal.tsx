import { useEffect, useState } from "react";
import { useCreateLpMutation } from "../hooks/useLpMutations";

type LpCreateModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const initialForm = {
    title: "",
    content: "",
    thumbnail: "",
    tagInput: "",
};

export default function LpCreateModal({ isOpen, onClose }: LpCreateModalProps) {
    const [form, setForm] = useState(initialForm);
    const [tags, setTags] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState("");
    const createMutation = useCreateLpMutation({
        onSuccess: () => {
            resetForm();
            onClose();
        },
    });

    function resetForm() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setForm(initialForm);
        setTags([]);
        setPreviewUrl("");
    }

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (!isOpen) {
        return null;
    }

    const addTag = () => {
        const tag = form.tagInput.trim();
        if (!tag || tags.includes(tag)) return;
        setTags((currentTags) => [...currentTags, tag]);
        setForm((currentForm) => ({ ...currentForm, tagInput: "" }));
    };

    const closeModal = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" role="dialog" aria-modal="true">
            <button type="button" className="absolute inset-0 cursor-default" aria-label="LP 작성 닫기" onClick={closeModal} />
            <form
                className="relative z-10 grid w-full max-w-lg gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-xl"
                onSubmit={(event) => {
                    event.preventDefault();
                    createMutation.mutate({
                        title: form.title,
                        content: form.content,
                        thumbnail: form.thumbnail,
                        tags,
                        published: true,
                    });
                }}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-950">LP 작성</h2>
                    <button type="button" className="text-2xl leading-none text-gray-500 hover:text-gray-950" onClick={closeModal}>
                        ×
                    </button>
                </div>

                <input
                    className="rounded-md border border-gray-200 px-4 py-2"
                    value={form.title}
                    onChange={(event) => setForm((currentForm) => ({ ...currentForm, title: event.target.value }))}
                    placeholder="제목"
                    required
                />

                <div className="grid gap-2">
                    <input
                        className="rounded-md border border-gray-200 px-4 py-2"
                        value={form.thumbnail}
                        onChange={(event) => setForm((currentForm) => ({ ...currentForm, thumbnail: event.target.value }))}
                        placeholder="썸네일 URL 또는 파일 preview URL"
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:text-white"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                            const nextPreviewUrl = URL.createObjectURL(file);
                            setPreviewUrl(nextPreviewUrl);
                            setForm((currentForm) => ({ ...currentForm, thumbnail: nextPreviewUrl }));
                        }}
                    />
                </div>

                <textarea
                    className="min-h-36 rounded-md border border-gray-200 px-4 py-2"
                    value={form.content}
                    onChange={(event) => setForm((currentForm) => ({ ...currentForm, content: event.target.value }))}
                    placeholder="내용"
                    required
                />

                <div className="grid gap-2">
                    <div className="flex gap-2">
                        <input
                            className="min-w-0 flex-1 rounded-md border border-gray-200 px-4 py-2"
                            value={form.tagInput}
                            onChange={(event) => setForm((currentForm) => ({ ...currentForm, tagInput: event.target.value }))}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    addTag();
                                }
                            }}
                            placeholder="태그"
                        />
                        <button type="button" className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50" onClick={addTag}>
                            추가
                        </button>
                    </div>
                    {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs text-pink-600">
                                    #{tag}
                                    <button type="button" className="font-bold" onClick={() => setTags((currentTags) => currentTags.filter((item) => item !== tag))}>
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="rounded-md bg-pink-500 px-4 py-2 font-medium text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {createMutation.isPending ? "작성 중..." : "Add LP"}
                </button>
            </form>
        </div>
    );
}
