import type { Dispatch, SetStateAction } from "react";

type Props = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

export const PageButton = ({page,setPage}:Props) => { 
    return (
    <>
    <div className="flex items-center justify-center gap-6 mt-5">
    <button className="bg-black text-white px-5 py-3 rounded-lg shadow-md hover:bg-[pink] 
    transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed
    "
    disabled={page===1}
    onClick={()=> setPage(prev=>prev-1)}>뒤 페이지</button>
    <span> {page} </span>
    <button className="bg-black text-white px-5 py-3 rounded-lg shadow-md hover:bg-[pink] 
    transition-all duration-200 cursor-pointer
    "
    onClick={()=> setPage(prev=>prev+1)}>다음 페이지</button>         
    </div>
   
    </>
      )
}