import { memo, useCallback } from 'react'
import type { Movie } from '../types/movie'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

interface MovieCardProps {
  movie: Movie
  onSelectMovie: (movie: Movie) => void
}

function MovieCard({ movie, onSelectMovie }: MovieCardProps) {
  // 카드 목록은 개수가 많아질 수 있어서 클릭 함수도 useCallback으로 관리합니다.
  const handleClick = useCallback(() => {
    onSelectMovie(movie)
  }, [movie, onSelectMovie])

  return (
    <button
      type="button"
      onClick={handleClick}
      className="overflow-hidden rounded-md bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center bg-slate-200 px-3 text-center text-sm text-slate-500">
            포스터 없음
          </div>
        )}

        <span className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white shadow">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <div className="space-y-1 p-3">
        <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-900">
          {movie.title}
        </h2>
        <p className="text-xs text-slate-500">
          {movie.release_date || '개봉일 정보 없음'}
        </p>
        <p className="line-clamp-3 text-xs leading-5 text-slate-600">
          {movie.overview || '등록된 줄거리가 없습니다.'}
        </p>
      </div>
    </button>
  )
}

// MovieCard는 반복 렌더링되므로 같은 movie와 handler라면 렌더링을 건너뛰게 합니다.
export default memo(MovieCard)
