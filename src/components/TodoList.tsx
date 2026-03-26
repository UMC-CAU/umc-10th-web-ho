import type { TTodo } from "../types/todo";

interface TodoListProps {
    title: string;
    todos?: TTodo[];
    buttonLable: string;
    buttonColor: string;
    onClick: (todo: TTodo) => void;
}

export const TodoList = ({
    title,
    todos,
    buttonColor,
    buttonLable,
    onClick,
}: TodoListProps) => {
    return (
        <div className="render-container__section">
            <h2 className="render-container__title">{title}</h2>

            <ul className="render-container__list">
                {todos?.map((todo) => (
                    <li key={todo.id} className="render-container__item">
                        <span className="render-container__item-text">
                            {todo.text}
                        </span>

                        <button
                            onClick={() => onClick?.(todo)}
                            style={{
                                backgroundColor: buttonColor,
                            }}
                            className="render-container__item-button"
                        >
                            {buttonLable}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;