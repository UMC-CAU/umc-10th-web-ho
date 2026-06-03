import { memo } from 'react'
import type { Movie } from '../types/movie'
import MovieCard from './MovieCard'

interface MovieListProps {
  movies: Movie[]
  onSelectMovie: (movie: Movie) => void
}

function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </div>
  )
}

export default memo(MovieList)
