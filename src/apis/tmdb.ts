import type { MovieSearchResponse } from '../types/movie'

const TMDB_SEARCH_MOVIE_URL = 'https://api.themoviedb.org/3/search/movie'

interface SearchMoviesParams {
  query: string
  includeAdult: boolean
  language: string
}

export async function searchMovies({
  query,
  includeAdult,
  language,
}: SearchMoviesParams): Promise<MovieSearchResponse> {
  const params = new URLSearchParams({
    query,
    include_adult: String(includeAdult),
    language,
  })

  const response = await fetch(`${TMDB_SEARCH_MOVIE_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error('TMDB 영화 검색 요청에 실패했습니다.')
  }

  return response.json()
}
