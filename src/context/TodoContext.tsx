import { Children, createContext, useContext, useState } from "react";
import type { TTodo } from "../types/todo";
import type { PropsWithChildren } from 'react';

interface ITodoContext{
    todos:TTodo[];
    doneTodos:TTodo[];
    addTodo:(text:string)=>void;
    completeTodo:(todo:TTodo)=>void;
    deleteTodo:(todo:TTodo)=>void;
}

export const TodoContext = createContext<ITodoContext|undefined>(undefined);

export const TodoProvider = ({children}:PropsWithChildren) =>{
    const [todos,setTodos] = useState<TTodo[]>([]);
    const [doneTodos,setDoneTodos]=useState<TTodo[]>([]);
    const addTodo  = (text:string) => {
            const newTodo:TTodo = {id:Date.now(),text};
            setTodos((prevTodos):TTodo[] => [...prevTodos,newTodo]);
                   
    };

                const completeTodo = (todo:TTodo) =>{
            setTodos(prevTodos=>
                prevTodos.filter((t)=>t.id
        !== todo.id));
        setDoneTodos(prevDoneTodos=>[...prevDoneTodos,todo]);
            };
    
            const deleteTodo = (todo:TTodo)=>{
            setDoneTodos((prevDoneTodo) =>
                prevDoneTodo.filter((t)=>t.id!==todo.id))
            }; 

    return (
        <TodoContext.Provider value={{todos,doneTodos,addTodo,deleteTodo,completeTodo}}>
            {children}
            </TodoContext.Provider>
    )
};

export const useTodo = () =>{
    const context = useContext(TodoContext);
    if(!context){
        throw new Error(
            '무조건 provider감싸야함'
        );
    }

    return context;
}