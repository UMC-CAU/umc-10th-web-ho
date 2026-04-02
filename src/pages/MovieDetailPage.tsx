import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { detailPage,detailPage2 } from "../types/detailPage";

const MovieDetailPage = () => {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<detailPage|null>(null);
  const [cast, setCast] = useState<detailPage2[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const { data } = await axios(
          `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(data);

        const castData = data.credits.cast.map((person:detailPage2) => ({
          name: person.name,
          profile_path: person.profile_path,
          character: person.character,
        }));

        setCast(castData);

      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  return (
    <div className="p-5">
      {isPending && <p>로딩중...</p>}
      {isError && <p>에러 발생</p>}

      {movie && (
        <>
<div
  className="relative w-full h-[500px] bg-cover bg-center"
  style={{
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
  }}
>
  {/* 🎬 텍스트 박스 (여기만 블러) */}
<div className="absolute bottom-0 left-0 p-10">
  <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl max-w-xl">
    
    <h1 className="text-3xl font-bold text-white">
      {movie?.original_title} 
    </h1>

    {/* 🔥 추가된 부분 */}
    <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
      <span> 평점:{movie?.vote_average?.toFixed(1)}</span>
      <span> {movie?.runtime}분</span>
      <span>{movie?.release_date?.slice(0, 4)}</span>
    </div>

    <p className="mt-3 text-gray-200">
      {movie?.overview}
    </p>
  </div>
</div>
</div>
        </>
      )}

      {/* 🎬 출연진 슬라이드 */}
      <div className="flex overflow-x-scroll gap-4 mt-5">
        {cast.map((person, idx) => (
          <div key={idx} className="w-24 flex-shrink-0 text-center">
            <img
              src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
              className="rounded-full"
            />
            <p className="text-sm">{person.name}</p>
            <p className="text-xs text-gray-400">
              {person.character}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;