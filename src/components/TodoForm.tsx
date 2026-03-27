import { useState, type FormEvent } from "react";
import { useTodo } from "../context/TodoContext";

interface TodoFormProps {
    input:string;
    setInput: (input:string)=>void;
    handleSubmit: (e:React.FormEvent<HTMLFormElement>) =>
        void;
}

const TodoForm = () => {
      const {addTodo}=useTodo();
      const [input,setInput] = useState<string>('');
      const handleSubmit = (e: FormEvent<HTMLFormElement>):void =>{
              e.preventDefault();
              const text = input.trim();
      
              if(text){
                  //addtodo
                  addTodo(text);
                  setInput('');
              }
          };

  
  return (
    <form onSubmit={handleSubmit} className="todo-container__form">
            <input 
            value={input}
            onChange={(e) =>setInput(e.target.value)}
            type="text" 
            className="todo-container__input"
            placeholder="할 일을 입력해주세요"
            required>
            </input>
            <button type="submit" className="todo-container__button">할 일 추가</button>
         </form>
  )
}

export default TodoForm;
