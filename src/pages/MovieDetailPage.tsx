import { useParams } from "react-router-dom";
import type { MovieDetailResponse } from "../types/detailPage";
import { useFetch } from "../hooks/useFetch";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const { data: movie, isPending, isError } = useFetch<MovieDetailResponse>(
    `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=ko-KR`,
    { enabled: !!movieId }
  );
  const cast = movie?.credits.cast ?? [];

  return (
    <div className="p-5">
      {isPending && <p>로딩중...</p>}
      {isError && <p>에러 발생</p>}

      {movie && (
        <div
          className="relative w-full h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="absolute bottom-0 left-0 p-10">
            <div className="max-w-xl rounded-xl bg-black/40 p-6 backdrop-blur-md">
              <h1 className="text-3xl font-bold text-white">
                {movie.original_title}
              </h1>

              <div className="mt-2 flex items-center gap-4 text-sm text-gray-300">
                <span>평점: {movie.vote_average.toFixed(1)}</span>
                <span>{movie.runtime}분</span>
                <span>{movie.release_date.slice(0, 4)}</span>
              </div>

              <p className="mt-3 text-gray-200">{movie.overview}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-4 overflow-x-scroll">
        {cast.map((person, idx) => (
          <div key={idx} className="w-24 flex-shrink-0 text-center">
            <img
              src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
              alt={person.name}
              className="rounded-full"
            />
            <p className="text-sm">{person.name}</p>
            <p className="text-xs text-gray-400">{person.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;
