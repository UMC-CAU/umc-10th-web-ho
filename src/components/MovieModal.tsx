import { memo, useCallback } from 'react'
import type { Movie } from '../types/movie'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780'

interface MovieModalProps {
  movie: Movie
  onClose: () => void
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  const handleImdbSearch = useCallback(() => {
    window.open(
      `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }, [movie.title])

  const backdropImage = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-full max-w-4xl overflow-y-auto rounded-md bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-xl leading-none text-white transition hover:bg-black"
        >
          x
        </button>

        <section
          className="relative flex min-h-64 items-end overflow-hidden bg-slate-900 bg-cover bg-center px-6 pb-8 pt-24 text-white"
          style={
            backdropImage
              ? { backgroundImage: `url(${backdropImage})` }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold sm:text-3xl">{movie.title}</h2>
            <p className="mt-2 text-sm text-slate-200">
              {movie.original_title}
              {movie.original_language && ` (${movie.original_language})`}
            </p>
          </div>
        </section>

        <section className="grid gap-6 p-6 md:grid-cols-[240px_1fr]">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              className="w-full rounded-md object-cover shadow-lg"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-md bg-slate-200 text-sm text-slate-500">
              포스터 없음
            </div>
          )}

          <div className="space-y-5 text-center md:text-left">
            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <div>
                <p className="font-bold text-slate-900">평점</p>
                <p className="mt-1 text-blue-600">
                  {movie.vote_average.toFixed(1)} ({movie.vote_count}명 평가)
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900">개봉일</p>
                <p className="mt-1">{movie.release_date || '정보 없음'}</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">인기도</p>
                <p className="mt-1">{Math.round(movie.popularity)}</p>
              </div>
            </div>

            <div className="h-1 rounded-full bg-slate-200">
              <div
                className="h-1 rounded-full bg-blue-500"
                style={{ width: `${Math.min(movie.vote_average * 10, 100)}%` }}
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">줄거리</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {movie.overview || '등록된 줄거리가 없습니다.'}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-2 sm:flex-row md:justify-start">
              <button
                type="button"
                onClick={handleImdbSearch}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                IMDb에서 검색
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                닫기
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default memo(MovieModal)
