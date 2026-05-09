import { ErrorState } from "../components/QueryState";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ProfilePage() {
    const { user, isLoading, isError, refetch } = useCurrentUser();

    if (isLoading && !user) {
        return <div className="p-6 text-sm text-gray-600">프로필을 불러오는 중입니다...</div>;
    }

    if (isError) {
        return <ErrorState title="프로필을 불러오지 못했습니다." onRetry={() => void refetch()} />;
    }

    if (!user) {
        return null;
    }

    return (
        <section className="mx-auto max-w-xl">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">로그인된 사용자</p>
                <h1 className="mt-2 text-2xl font-semibold text-gray-950">{user.name}</h1>
                <p className="mt-1 text-sm text-gray-600">{user.email}</p>
            </div>
        </section>
    );
}
