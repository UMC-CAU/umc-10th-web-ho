import { useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PageButton } from "../components/pageButton";
import { useFetch } from "../hooks/useFetch";
import type { MovieResponse } from "../types/movie";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{
    category: string;
  }>();

  const { data, isPending, isError } = useFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
    { enabled: !!category }
  );

  const movies = data?.results ?? [];

  return (
    <>
      <PageButton page={page} setPage={setPage} />

      {isPending && (
        <div className="flex h-dvh items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {isError && (
        <div className="flex h-dvh items-center justify-center">
          <span className="text-2xl text-red-500">에러가 발생했습니다.</span>
        </div>
      )}

      {!isPending && !isError && (
        <div className="gird-cols-2 grid gap-4 p-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
