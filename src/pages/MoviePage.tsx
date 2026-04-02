import { useEffect, useState } from "react"
import axios from "axios";
import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PageButton } from "../components/pageButton";
import { useParams } from "react-router-dom";

export default function MoviePage () {
    const [movies,setMovies] = useState<Movie[]>([]);
    //1 로딩 상태
    const [isPending,setIsPending] = useState(false);
    //2.에러 상태
    const [isError,setIsError] = useState(false);
    //3.페이지
    const [page,setPage] = useState(1);
    //4.Navbar
    const {category} = useParams<{
        category:string;
    }>();

    useEffect(()=>{
        const fetchMovies = async () => {
            setIsPending(true);
            try {
            const {data} =await axios(
            `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                }
            }
        );
            setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };    

        fetchMovies();
        
    },[page,category]); 

    /*if (isError){
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }*/


return(
    <>
    <PageButton page={page} setPage={setPage} />

    {isPending && (
        <div className="flex items-center justify-center h-dvh">
            <LoadingSpinner/>
        </div>
    )}

    {!isPending && (
    <div className='p-10 grid gap-4 gird-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {movies && movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie}/>
        ))}
    </div>        
    ) 
    }

    </>

    );

}
