export function formatDate(dateText: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(dateText));
}
