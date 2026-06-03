import { useCallback, useEffect, useState } from 'react'
import { searchMovies } from '../apis/tmdb'
import { DEFAULT_QUERY } from '../constants/movie'
import type { Movie } from '../types/movie'

export function useFetch() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasSearched, setHasSearched] = useState(true)

  const fetchMovieList = useCallback(
    async (keyword: string, includeAdult: boolean, language: string) => {
      setIsLoading(true)
      setErrorMessage('')
      setHasSearched(true)

      try {
        const data = await searchMovies({
          query: keyword,
          includeAdult,
          language,
        })
        setMovies(data.results)
      } catch (error) {
        console.error(error)
        setMovies([])
        setErrorMessage('영화 목록을 불러오지 못했습니다. TMDB 토큰을 확인해주세요.')
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    let isMounted = true

    const loadDefaultMovies = async () => {
      try {
        const data = await searchMovies({
          query: DEFAULT_QUERY,
          includeAdult: false,
          language: 'ko-KR',
        })

        if (isMounted) {
          setMovies(data.results)
        }
      } catch (error) {
        console.error(error)

        if (isMounted) {
          setMovies([])
          setErrorMessage('영화 목록을 불러오지 못했습니다. TMDB 토큰을 확인해주세요.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadDefaultMovies()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    movies,
    isLoading,
    errorMessage,
    hasSearched,
    fetchMovieList,
  }
}
