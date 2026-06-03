import { useCallback, useMemo, useState } from 'react'
import MovieList from '../components/MovieList'
import MovieModal from '../components/MovieModal'
import SearchForm from '../components/SearchForm'
import { DEFAULT_QUERY } from '../constants/movie'
import { useFetch } from '../hooks/useFetch'
import type { Movie } from '../types/movie'

function HomePage() {
  const [query, setQuery] = useState('')
  const [includeAdult, setIncludeAdult] = useState(false)
  const [language, setLanguage] = useState('ko-KR')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const { movies, isLoading, errorMessage, hasSearched, fetchMovieList } =
    useFetch()

  // 검색 결과를 화면에 보여주기 전에 인기도순으로 정렬한 값을 memoization 합니다.
  // movies가 바뀔 때만 다시 계산되어 불필요한 정렬을 줄입니다.
  const sortedMovies = useMemo(
    () => [...movies].sort((a, b) => b.popularity - a.popularity),
    [movies],
  )

  const movieCount = useMemo(() => sortedMovies.length, [sortedMovies])

  // React.memo 컴포넌트에 props로 내려가는 함수라 useCallback으로 참조를 유지합니다.
  const handleSubmit = useCallback(async () => {
    const keyword = query.trim() || DEFAULT_QUERY
    await fetchMovieList(keyword, includeAdult, language)
  }, [fetchMovieList, includeAdult, language, query])

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null)
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5">
        <SearchForm
          query={query}
          includeAdult={includeAdult}
          language={language}
          isLoading={isLoading}
          onQueryChange={setQuery}
          onIncludeAdultChange={setIncludeAdult}
          onLanguageChange={setLanguage}
          onSubmit={handleSubmit}
        />

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">영화 목록</h1>
          {hasSearched && !isLoading && (
            <p className="text-sm text-slate-600">총 {movieCount}개</p>
          )}
        </div>

        {errorMessage && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        {isLoading && (
          <p className="mt-3 rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
            영화를 불러오는 중입니다...
          </p>
        )}

        {!isLoading && hasSearched && movieCount === 0 && !errorMessage && (
          <p className="mt-3 rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
            검색 결과가 없습니다.
          </p>
        )}

        {!isLoading && movieCount > 0 && (
          <MovieList movies={sortedMovies} onSelectMovie={handleSelectMovie} />
        )}
      </section>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </main>
  )
}

export default HomePage
