import { useEffect, useState } from "react";
import axiosInstance from "../apis/axios";

type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

type UserProfile = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    provider?: string;
    googleId?: string | null;
    createdAt: string;
    updatedAt: string;
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            try {
                const response = await axiosInstance.get<CommonResponse<UserProfile>>("/users/me");

                if (!isMounted) {
                    return;
                }

                setProfile(response.data.data);
            } catch {
                if (!isMounted) {
                    return;
                }

                setErrorMessage("프로필 정보를 불러오지 못했습니다.");
            } finally {
                if (!isMounted) {
                    return;
                }

                setIsLoading(false);
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return <div className="p-6 text-sm text-gray-600">프로필을 불러오는 중입니다...</div>;
    }

    if (errorMessage) {
        return <div className="p-6 text-sm text-red-600">{errorMessage}</div>;
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                    {profile.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>
                <div>
                    <p className="text-sm text-gray-500">로그인된 사용자</p>
                    <h1 className="text-2xl font-semibold text-gray-900">{profile.name}</h1>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
                <div>Provider: {profile.provider ?? "LOCAL"}</div>
                <div>Bio: {profile.bio ?? "소개가 없습니다."}</div>
                <div>Google ID: {profile.googleId ?? "연동되지 않음"}</div>
            </div>
        </div>
    );
}