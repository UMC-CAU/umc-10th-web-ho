import { useState } from "react";

type FallbackImageProps = {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackClassName?: string;
};

const CAT_FALLBACK_URL = "https://cataas.com/cat?width=800&height=800";
const BACKUP_CAT_URL =
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80";

function resolveImageSrc(src?: string | null) {
    if (!src) {
        return null;
    }

    if (/^https?:\/\//i.test(src) || src.startsWith("data:")) {
        return src;
    }

    const apiUrl = import.meta.env.VITE_SERVER_API_URL;

    if (!apiUrl) {
        return src;
    }

    return new URL(src, apiUrl).toString();
}

export default function FallbackImage({
    src,
    alt,
    className,
    fallbackClassName = "h-full w-full object-cover",
}: FallbackImageProps) {
    const imageSrc = resolveImageSrc(src);
    const [failedSrcs, setFailedSrcs] = useState<string[]>([]);
    const displaySrc =
        imageSrc && !failedSrcs.includes(imageSrc)
            ? imageSrc
            : !failedSrcs.includes(CAT_FALLBACK_URL)
              ? CAT_FALLBACK_URL
              : BACKUP_CAT_URL;
    const isFallback = displaySrc !== imageSrc;

    return (
        <img
            src={displaySrc}
            alt={alt}
            className={isFallback ? fallbackClassName : className}
            loading="lazy"
            onError={() => setFailedSrcs((currentSrcs) => [...currentSrcs, displaySrc])}
        />
    );
}
