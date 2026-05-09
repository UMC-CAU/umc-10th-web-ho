function SkeletonBlock({ className }: { className: string }) {
    return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function LpCardSkeleton() {
    return (
        <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
            <SkeletonBlock className="h-full w-full" />
        </div>
    );
}

export function LpCardSkeletonGrid({ count = 8 }: { count?: number }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }, (_, index) => (
                <LpCardSkeleton key={index} />
            ))}
        </div>
    );
}

export function CommentSkeleton() {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
                <SkeletonBlock className="size-9 rounded-full" />
                <div className="grid flex-1 gap-2">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-3 w-24" />
                </div>
            </div>
            <div className="mt-4 grid gap-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-4/5" />
            </div>
        </div>
    );
}

export function CommentSkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="grid gap-3">
            {Array.from({ length: count }, (_, index) => (
                <CommentSkeleton key={index} />
            ))}
        </div>
    );
}
