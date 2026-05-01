import { useEffect, useState } from "react";
import axios from "axios";

type UseFetchOptions = {
  enabled?: boolean;
};

export function useFetch<T>(url: string, options?: UseFetchOptions) {
  const enabled = options?.enabled ?? true;

  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsPending(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const response = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });

        if (!isMounted) return;
        setData(response.data);
      } catch {
        if (!isMounted) return;
        setIsError(true);
      } finally {
        if (!isMounted) return;
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [enabled, url]);

  return { data, isPending, isError };
}
