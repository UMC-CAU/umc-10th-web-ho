type QueryStateProps = {
    title?: string;
    message?: string;
    onRetry?: () => void;
};

export function LoadingState() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="aspect-square animate-pulse rounded-lg bg-gray-200"
                />
            ))}
        </div>
    );
}

export function ErrorState({
    title = "데이터를 불러오지 못했습니다.",
    message = "잠시 후 다시 시도해주세요.",
    onRetry,
}: QueryStateProps) {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{message}</p>
            {onRetry ? (
                <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                    다시 시도
                </button>
            ) : null}
        </div>
    );
}
