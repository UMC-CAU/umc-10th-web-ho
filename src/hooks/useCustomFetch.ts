import { useQuery } from '@tanstack/react-query'

export const useCustomFetch = <T>(url: string) => {
  return useQuery({
    // 쿼리 키: 데이터를 식별하고 캐싱하는 고유 키입니다.
    // url이 같으면 같은 캐시를 공유하고, url이 다르면 별도의 데이터로 관리됩니다.
    queryKey: [url],

    // 쿼리 함수: 실제로 데이터를 가져오는 비동기 함수입니다.
    // React Query가 AbortSignal을 자동으로 제공하므로 fetch에 연결하면 요청 취소도 지원됩니다.
    queryFn: async ({ signal }) => {
      const response = await fetch(url, { signal })

      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`)
      }

      return response.json() as Promise<T>
    },

    // 실패 시 최대 3회 자동 재시도합니다.
    retry: 3,

    // 재시도 간격은 지수 백오프 전략을 사용합니다.
    // 0회차: 1초, 1회차: 2초, 2회차: 4초이며 최대 30초로 제한합니다.
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // 5분 동안은 데이터를 fresh로 보고 네트워크 요청 대신 캐시를 우선 사용합니다.
    staleTime: 5 * 60 * 1000,

    // 쿼리가 사용되지 않은 채 10분이 지나면 캐시에서 제거합니다.
    gcTime: 10 * 60 * 1000,
  })
}
