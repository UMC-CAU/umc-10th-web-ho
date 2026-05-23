import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-950">페이지를 찾을 수 없습니다.</h1>
            <p className="text-sm text-gray-500">주소를 확인하거나 LP 목록으로 돌아가주세요.</p>
            <Link to="/" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
                LP 목록으로
            </Link>
        </div>
    );
}
