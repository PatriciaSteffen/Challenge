import { Route, Routes } from "react-router-dom";
import NotFound from "./components/notfound";
import TodoList from "./components/todolist";
import { TodoProvider } from "./TodoContext";

const Views = () => {
    return (
        <Routes>
            <Route index element={
                <TodoProvider>
                    <TodoList />
                </TodoProvider>
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );

}

export default Views;