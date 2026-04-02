import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">404</h1>
      <p>페이지를 찾을 수 없습니다</p>

      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        홈으로 가기
      </Link>
    </div>
  );
}