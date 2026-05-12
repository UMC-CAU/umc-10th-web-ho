import { useState } from "react";
import { ErrorState } from "../components/QueryState";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUpdateProfileMutation } from "../hooks/useProfileMutation";

export default function ProfilePage() {
    const { user, isLoading, isError, refetch } = useCurrentUser();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const updateMutation = useUpdateProfileMutation({
        onSuccess: () => setIsEditing(false),
    });

    if (isLoading && !user) {
        return <div className="p-6 text-sm text-gray-600">프로필을 불러오는 중입니다...</div>;
    }

    if (isError) {
        return <ErrorState title="프로필을 불러오지 못했습니다." onRetry={() => void refetch()} />;
    }

    if (!user) {
        return null;
    }

    const startEditing = () => {
        setName(user.name ?? "");
        setBio(user.bio ?? "");
        setAvatar(user.avatar ?? "");
        setIsEditing(true);
    };

    return (
        <section className="mx-auto max-w-xl">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm text-gray-500">로그인된 사용자</p>
                        <h1 className="mt-2 text-2xl font-semibold text-gray-950">{user.name}</h1>
                        <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                    </div>
                    <button
                        type="button"
                        className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={startEditing}
                    >
                        설정
                    </button>
                </div>

                {user.avatar ? <img src={user.avatar} alt={user.name} className="mt-4 size-20 rounded-full object-cover" /> : null}
                {user.bio ? <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">{user.bio}</p> : null}

                {isEditing ? (
                    <form
                        className="mt-6 grid gap-3 border-t border-gray-100 pt-5"
                        onSubmit={(event) => {
                            event.preventDefault();
                            updateMutation.mutate({ name, bio, avatar });
                        }}
                    >
                        <input
                            className="rounded-md border border-gray-200 px-4 py-2"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="이름"
                        />
                        <textarea
                            className="min-h-28 rounded-md border border-gray-200 px-4 py-2"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="소개"
                        />
                        <input
                            className="rounded-md border border-gray-200 px-4 py-2"
                            value={avatar}
                            onChange={(event) => setAvatar(event.target.value)}
                            placeholder="아바타 URL"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                                onClick={() => setIsEditing(false)}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {updateMutation.isPending ? "저장 중..." : "저장"}
                            </button>
                        </div>
                    </form>
                ) : null}
            </div>
        </section>
    );
}
